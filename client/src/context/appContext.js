import { createContext, useContext, useReducer } from 'react';
import { reducer } from './reducer';
import axios from 'axios';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  UPDATE_JOB_BEGIN,
  UPDATE_JOB_SUCCESS,
  DELETE_JOB_BEGIN,
  UPDATE_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
} from './actions';

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const userLocation = localStorage.getItem('location');

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  jobLocation: userLocation || '',
  position: '',
  company: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  jobStatusOptions: ['pending', 'interview', 'declined'],
  jobStatus: 'pending',
  jobs: [],
  stats: {},
  monthlyApplications: [],
  totalJobs: 0,
  pageCount: 1,
  page: 1,
};

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Custom axios instance with jwt
  const authInstance = axios.create({
    baseURL: '/api/v1',
  });

  // Request interceptor to set authorization header with jwt
  authInstance.interceptors.request.use(
    (config) => {
      // set the authorization header before request is sent
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  authInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  /**
   * Helper function to add an authenticated user to localStorage
   * @param user - authenticated user object
   * @param token - authenticated user JWT with userID
   * @param location - authenticated user's location
   */
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  };

  /**
   * Helper function to remove an authenticated user to localStorage
   * @param user - authenticated user object
   * @param token - authenticated user JWT with userID
   * @param location - authenticated user's location
   */
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('location');
  };

  /**
   * Helper function to handle login/registration
   * @param currentUser - user name/email/password from auth form
   * @param endpoint - login or register based on form type
   * @param alertText - Text to display on success alert
   */
  const setupUser = async ({ currentUser, endpoint, alertText }) => {
    try {
      dispatch({ type: SETUP_USER_BEGIN });

      const res = await axios.post(`/api/v1/auth/${endpoint}`, currentUser);

      const { user, location, token } = res.data;

      addUserToLocalStorage({ user, token, location });

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, token, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    removeUserFromLocalStorage();
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const res = await authInstance.patch('/auth/updateUser', currentUser);
      const { user, location, token } = res.data;

      addUserToLocalStorage({ user, token, location });

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    let url = `/jobs`;
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const res = await authInstance.get(url);
      const { jobs, totalJobs, pageCount } = res.data;

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobs, totalJobs, pageCount },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  // Helper function for updating state values related to job
  // I.E company, position, jobLocation, jobStatus, jobType
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createJob = async (newJob) => {
    dispatch({ type: CREATE_JOB_BEGIN });

    try {
      const res = await authInstance.post('/jobs/', newJob);
      const { job } = res.data;
      dispatch({ type: CREATE_JOB_SUCCESS, payload: { job } });
    } catch (error) {
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: UPDATE_JOB_BEGIN });

    try {
      const { company, position, jobLocation, jobType, jobStatus } = state;
      await authInstance.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        jobStatus,
      });
      dispatch({ type: UPDATE_JOB_SUCCESS });
      clearValues();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: UPDATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authInstance.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });

    try {
      const { data } = await authInstance.get('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.stats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
