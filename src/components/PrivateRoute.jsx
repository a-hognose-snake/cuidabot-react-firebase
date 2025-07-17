import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute({ role }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}