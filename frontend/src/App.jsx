import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/Auth/LoginPage';
import HomeDashboard from './pages/Dashboard/HomeDashboard';
import ProjectsPage from './pages/Projects/ProjectsPage';
import BeamDesignPage from './pages/BeamDesign/BeamDesignPage';
import AnalysisPage from './pages/Analysis/AnalysisPage';
import EvaluationPage from './pages/Evaluation/EvaluationPage';
import RecommendationsPage from './pages/Recommendations/RecommendationsPage';
import XAIDashboardPage from './pages/ExplainableAI/XAIDashboardPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';

import HistoryPage from './pages/History/HistoryPage';

import ComparisonPage from './pages/Comparison/ComparisonPage';

// Simple ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/beam-design" element={<ProtectedRoute><BeamDesignPage /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
          <Route path="/evaluation" element={<ProtectedRoute><EvaluationPage /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
          <Route path="/xai" element={<ProtectedRoute><XAIDashboardPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
