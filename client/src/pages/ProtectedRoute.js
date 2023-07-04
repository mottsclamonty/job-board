import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import { Loading } from '../components';
/**
 * Protected route to prevent unauthenticated users from accessing pages
 */
const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();

  if (userLoading) return <Loading center />;

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return children;
};

export default ProtectedRoute;
