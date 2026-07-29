import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import MetricCard from '../../components/common/MetricCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import HealthGauge from '../../components/common/HealthGauge';
import { useAuth } from '../../context/AuthContext';
import { useAnalysis } from '../../context/AnalysisContext';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeAnalysis, historyList } = useAnalysis();

  const totalAnalyses = historyList.length;
  
  const avgHealth = totalAnalyses > 0
    ? (historyList.reduce((acc, h) => acc + (h.beam_health_score || 85), 0) / totalAnalyses).toFixed(1)
    : '--';

  const avgPmax = totalAnalyses > 0
    ? (historyList.reduce((acc, h) => acc + (parseFloat(h.prediction?.pmax) || 0), 0) / totalAnalyses).toFixed(1)
    : '--';

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-300 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AHEM AI ENGINE • STRUCTURAL ANALYTICS DASHBOARD
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-navy-900 tracking-tight">
              Welcome back, {user?.name || 'Engineer'}
            </h1>
            <p className="text-xs text-navy-500 mt-1 font-mono">
              AI-Powered Decision Support System for Reinforced Concrete Structural Analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon="folder_open"
              onClick={() => navigate('/projects')}
            >
              Projects Workspace
            </Button>
            <Button
              variant="accent"
              icon="play_arrow"
              onClick={() => navigate('/beam-design')}
            >
              Beam Input & Analyze
            </Button>
          </div>
        </div>

        {/* Real Analytical Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Analyses Run"
            value={totalAnalyses > 0 ? String(totalAnalyses) : "0"}
            subtitle="Saved in session history"
            icon="analytics"
            statusColor="steel"
            badgeText={totalAnalyses > 0 ? "LIVE" : "EMPTY"}
          />
          <MetricCard
            title="Average Health Score"
            value={avgHealth !== '--' ? `${avgHealth}%` : '--'}
            subtitle="Across completed runs"
            icon="health_and_safety"
            statusColor={avgHealth !== '--' && parseFloat(avgHealth) >= 80 ? "green" : "amber"}
          />
          <MetricCard
            title="Average Pmax Capacity"
            value={avgPmax !== '--' ? `${avgPmax} kN` : '--'}
            subtitle="AHEM Ensemble Mean"
            icon="fitness_center"
            statusColor="cyan"
          />
          <MetricCard
            title="Active Model Architecture"
            value="AHEM"
            subtitle="RF + ET + LightGBM + CatBoost"
            icon="account_tree"
            statusColor="green"
            badgeText="ONLINE"
          />
        </div>

        {/* Active Analysis Hero Display */}
        {activeAnalysis ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-heading font-bold text-navy-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600">stars</span>
                Latest Active Analysis ({activeAnalysis.beamName})
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon="open_in_new"
                onClick={() => navigate('/analysis')}
              >
                Open Full Analysis
              </Button>
            </div>

            <HealthGauge
              score={activeAnalysis.beam_health_score}
              status={activeAnalysis.beam_health_score >= 85 ? 'PASS' : 'WARNING'}
              title={`Latest Analysis: ${activeAnalysis.beamName}`}
            />
          </div>
        ) : (
          <div className="bg-white p-10 rounded border border-concrete-300 shadow-blueprint text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-navy-400">architecture</span>
            <h3 className="font-heading font-bold text-base text-navy-900">No Structural Analysis Run Yet</h3>
            <p className="text-xs text-navy-500 font-mono">
              Start by defining a beam section in Beam Input and clicking "Save & Analyze".
            </p>
            <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/beam-design')}>
              Create Beam Input & Run Analysis
            </Button>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
