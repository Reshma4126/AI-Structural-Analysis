import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<HomeDashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/beam-design" element={<BeamDesignPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/xai" element={<XAIDashboardPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
