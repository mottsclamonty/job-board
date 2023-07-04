import { createContext, useContext, useEffect, useReducer } from 'react';
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
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from './actions';

const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  jobLocation: '',
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
  search: '',
  searchStatus: '',
  searchType: '',
  sort: '',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  searchLimit: 10,
  searchLimitOptions: [10, 20, 50, 100],
};

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Custom axios instance with jwt
  const authInstance = axios.create({
    baseURL: '/api/v1',
  });

  // Response interceptor - logout user if unauthorized
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

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
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

      const { user, location } = res.data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });

    try {
      const res = await authInstance.get('/auth/getCurrentUser');
      const { user, location } = res.data;

      dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, location } });
    } catch (error) {
      if (error.response.status === 401) return;
      logoutUser();
    }
  };

  const logoutUser = async () => {
    await authInstance.get('/auth/logoutCurrentUser');
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const res = await authInstance.patch('/auth/updateUser', currentUser);
      const { user, location } = res.data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: {
          user,
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
    const { search, searchStatus, searchType, sort, searchLimit, page } = state;
    let url = `/jobs/?jobStatus=${searchStatus}&jobType=${searchType}&sort=${sort}&limit=${searchLimit}&page=${page}`;

    // search can be empty so leave as optional
    if (search) {
      url = url + `&search=${search}`;
    }
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

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        toggleSidebar,
        setupUser,
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
        clearFilters,
        changePage,
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
