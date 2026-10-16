import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AuthLoadingScreen } from './AuthLoadingScreen';

export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { isAdminAuthenticated, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  if (loading || adminLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname;
    const destination = from && from !== '/login' && from !== '/register' ? from : '/';
    return <Navigate to={destination} replace />;
  }

  return children;
}
