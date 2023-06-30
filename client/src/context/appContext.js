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
} from './actions';

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const userLocation = localStorage.getItem('location');

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  showSidebar: false,
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
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
    try {
      dispatch({ type: UPDATE_USER_BEGIN });

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
