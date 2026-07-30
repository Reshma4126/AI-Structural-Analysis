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
        <div className="space-y-6 max-w-7xl mx-auto font-body">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-brandBg border border-concrete-300 flex items-center justify-center text-brandNavy mx-auto">
              <span className="material-symbols-outlined text-3xl">tips_and_updates</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-brandNavy">No active analysis recommendations available</h3>
              <p className="text-xs text-brandSteel max-w-md mx-auto">
                Run an AI analysis on a beam section first to generate automated structural recommendations.
              </p>
            </div>
            <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/beam-design')}>
              Create Beam Input
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const beamName = activeAnalysis.beamName || 'Beam Section';

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-body">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brandOrange mb-1 font-bold">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              STRUCTWISE AI • RECOMMENDATION ENGINE
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-brandNavy tracking-tight">
              AI-Assisted Structural Recommendations
            </h1>
            <p className="text-xs text-brandSteel mt-1">
              Automated structural optimization & redesign recommendations for <strong className="text-brandNavy">{beamName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon="tune"
              onClick={() => navigate('/beam-design')}
            >
              Modify Parameters
            </Button>
            <Button
              variant="accent"
              icon="play_arrow"
              onClick={() => navigate('/analysis')}
            >
              Back to Analysis
            </Button>
          </div>
        </div>

        {/* Dynamic Multi-Option Recommendation Card Component */}
        <RecommendationCard 
          recommendation={activeAnalysis.recommendation} 
          beamData={{ beamParams: activeAnalysis.beamParams, prediction: activeAnalysis.prediction }} 
        />

      </div>
    </MainLayout>
  );
}
