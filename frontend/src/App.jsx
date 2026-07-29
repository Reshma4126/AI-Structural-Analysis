import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnalysisProvider } from './context/AnalysisContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import HomeDashboard from './pages/Dashboard/HomeDashboard';
import ProjectsPage from './pages/Projects/ProjectsPage';
import BeamDesignPage from './pages/BeamDesign/BeamDesignPage';
import AnalysisPage from './pages/Analysis/AnalysisPage';
import ComparisonPage from './pages/Comparison/ComparisonPage';
import EvaluationPage from './pages/Evaluation/EvaluationPage';
import RecommendationsPage from './pages/Recommendations/RecommendationsPage';
import XAIDashboardPage from './pages/ExplainableAI/XAIDashboardPage';
import ReportsPage from './pages/Reports/ReportsPage';
import HistoryPage from './pages/History/HistoryPage';
import SettingsPage from './pages/Settings/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
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
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AnalysisProvider>
    </AuthProvider>
  );
}
