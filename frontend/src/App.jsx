import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import HomeDashboard from './pages/Dashboard/HomeDashboard';
import ProjectsPage from './pages/Projects/ProjectsPage';
import BeamDesignPage from './pages/BeamDesign/BeamDesignPage';
import SettingsPage from './pages/Settings/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Modules 1, 2, 3 Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beam-design"
            element={
              <ProtectedRoute>
                <BeamDesignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
