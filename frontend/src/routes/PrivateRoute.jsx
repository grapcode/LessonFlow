import React from 'react';
import { Navigate, useLocation } from 'react-router';
import MyLoading from '../components/my-components/MyLoading';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  // const { user, loading } = useContext(AuthContext);
  const { user, loading } = useAuth();
  // 📍 current location thek onno jagay pathate
  const location = useLocation();
  console.log(location);

  if (loading) {
    return <MyLoading></MyLoading>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};

export default PrivateRoute;
