import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center font-mono">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyanAccent-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
