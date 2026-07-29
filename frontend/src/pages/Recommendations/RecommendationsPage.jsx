import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import RecommendationCard from '../../components/common/RecommendationCard';
import { useAnalysis } from '../../context/AnalysisContext';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { activeAnalysis } = useAnalysis();

  if (!activeAnalysis) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyanAccent-50 border border-cyanAccent-200 flex items-center justify-center text-cyanAccent-600 mx-auto">
              <span className="material-symbols-outlined text-3xl">tips_and_updates</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">No active analysis recommendations available</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Run an AI analysis on a beam section first to generate automated structural recommendations.
              </p>
            </div>
            <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/analysis')}>
              Run Beam Analysis
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const beamName = activeAnalysis.beamName || 'Beam Section';

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 mb-1 font-bold">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              MODULE 6 • RULE-BASED AI RECOMMENDATION ENGINE
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
              AI Section & Design Recommendations
            </h1>
            <p className="text-xs text-navy-500 mt-1">
              Automated structural optimization recommendations for <strong className="text-navy-900">{beamName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon="tune"
              onClick={() => navigate('/beam-design')}
            >
              Modify Beam Section
            </Button>
          </div>
        </div>

        {/* Dynamic Recommendation Panel for Active Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-navy-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-steel-600">tips_and_updates</span>
              Generated Advisory Output for {beamName}
            </h2>
            <Badge variant="green">VALIDATED</Badge>
          </div>

          <RecommendationCard recommendation={activeAnalysis.recommendation} />
        </div>

      </div>
    </MainLayout>
  );
}
