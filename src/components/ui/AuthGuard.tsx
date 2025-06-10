import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'react-router-dom';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner component
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;