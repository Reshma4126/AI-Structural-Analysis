import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import MetricCard from '../../components/common/MetricCard';
import Button from '../../components/common/Button';
import HealthGauge from '../../components/common/HealthGauge';
import StructWiseLogo from '../../components/common/StructWiseLogo';
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

  const latestFailureMode = historyList[0]?.prediction?.failure_mode || '--';

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

        {/* ─── Logo Banner ─── */}
        <div className="sw-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <StructWiseLogo className="h-14 w-auto" />
            <div className="hidden sm:block w-px h-10 bg-[#E2E8F0]" />
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#F97316]">
                AI-Powered Structural Intelligence Platform
              </p>
              <p className="text-xs text-[#64748B] font-body mt-0.5">
                Reinforced Concrete Beam Analysis • AISC 360-16 / IS 456
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" icon="compare_arrows" size="sm" onClick={() => navigate('/comparison')}>
              Compare Beams
            </Button>
            <Button variant="accent" icon="add" size="sm" onClick={() => navigate('/beam-design')}>
              New Beam Analysis
            </Button>
          </div>
        </div>

        {/* ─── Welcome Header ─── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#10B981]">
              System Online
            </span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-[#0F172A] tracking-tight">
            Welcome back, {user?.name || 'Engineer'} 👋
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Here's your structural engineering workspace overview.
          </p>
        </div>

        {/* ─── KPI Metrics Grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Analyses"
            value={String(totalAnalyses)}
            subtitle="Stored in history"
            icon="analytics"
            statusColor="steel"
            badgeText={totalAnalyses > 0 ? 'ACTIVE' : 'EMPTY'}
          />
          <MetricCard
            title="Avg Health Score"
            value={avgHealth !== '--' ? `${avgHealth}%` : '--'}
            subtitle="Across all runs"
            icon="health_and_safety"
            statusColor={avgHealth !== '--' && parseFloat(avgHealth) >= 80 ? 'green' : 'amber'}
          />
          <MetricCard
            title="Avg Pmax Capacity"
            value={avgPmax !== '--' ? `${avgPmax} kN` : '--'}
            subtitle="AHEM ensemble mean"
            icon="fitness_center"
            statusColor="cyan"
          />
          <MetricCard
            title="ML Model"
            value="AHEM"
            subtitle="RF + ET + LGB + CAT"
            icon="account_tree"
            statusColor="green"
            badgeText="ONLINE"
          />
        </div>

        {/* ─── Active Analysis or Empty State ─── */}
        {activeAnalysis ? (
          <div className="space-y-4">
            {/* Section title */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F97316] text-lg">stars</span>
                Latest Analysis — {activeAnalysis.beamName}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon="description" onClick={() => navigate('/reports')}>
                  View Report
                </Button>
                <Button variant="primary" size="sm" icon="open_in_new" onClick={() => navigate('/analysis')}>
                  Full Analysis
                </Button>
              </div>
            </div>

            {/* Health Gauge */}
            <HealthGauge
              score={activeAnalysis.beam_health_score}
              status={activeAnalysis.beam_health_score >= 85 ? 'PASS' : activeAnalysis.beam_health_score >= 70 ? 'WARNING' : 'FAIL'}
              title={`${activeAnalysis.beamName} — Beam Health Score`}
            />

          </div>
        ) : (
          <div className="sw-card p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-[#94A3B8]">architecture</span>
            </div>
            <h3 className="font-heading font-bold text-base text-[#0F172A]">No Analysis Run Yet</h3>
            <p className="text-xs text-[#64748B] font-body max-w-sm mx-auto">
              Define a beam section in Beam Input and click "Save & Analyze" to generate your first structural assessment.
            </p>
            <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/beam-design')}>
              Start Beam Analysis
            </Button>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
