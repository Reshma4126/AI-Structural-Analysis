import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MetricCard from '../../components/common/MetricCard';
import Modal from '../../components/common/Modal';
import { sampleBeamCalculations } from '../../services/mockData';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(sampleBeamCalculations.aiRecommendations);
  const [selectedRec, setSelectedRec] = useState(recommendations[0]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleApply = (rec) => {
    setSelectedRec(rec);
    setIsSuccessModalOpen(true);
  };

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 mb-1">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            AI OPTIMIZATION ENGINE • STEEL WEIGHT MINIMIZER
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            AI Section Recommendations
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Generative structural optimization evaluating over 2,400 standard AISC profiles for minimum weight & carbon.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="refresh"
            onClick={() => alert('AI Engine re-evaluating optimal shapes for Beam B-104...')}
          >
            Re-run Optimization
          </Button>
        </div>
      </div>

      {/* Comparison Spotlight Banner */}
      <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-6">
        <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
          <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-steel-600">compare</span>
            Current Baseline vs Top AI Recommendation
          </h2>
          <Badge variant="cyan" icon="auto_awesome">AI OPTIMIZED CANDIDATE</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baseline Side */}
          <div className="p-5 bg-concrete-50 rounded border border-concrete-300 space-y-3 relative">
            <span className="text-[10px] font-mono text-navy-400 font-bold uppercase block">
              Current Baseline Section
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-navy-900">
                {sampleBeamCalculations.currentProfile}
              </span>
              <span className="text-xs font-mono text-navy-500">113.1 kg/m</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-concrete-200">
              <div><span className="text-navy-400">Depth:</span> <span className="font-bold">540 mm</span></div>
              <div><span className="text-navy-400">Safety Factor:</span> <span className="font-bold text-emerald-600">1.48</span></div>
              <div><span className="text-navy-400">Moment Capacity:</span> <span className="font-bold">742.0 kN·m</span></div>
              <div><span className="text-navy-400">Cost Impact:</span> <span className="font-bold">$0 (Baseline)</span></div>
            </div>
          </div>

          {/* AI Recommended Side */}
          <div className="p-5 bg-gradient-to-br from-steel-50 via-cyanAccent-50/40 to-white rounded border-2 border-cyanAccent-500 space-y-3 relative shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyanAccent-700 font-bold uppercase block">
                Top AI Section Recommendation
              </span>
              <Badge variant="cyan" size="sm">SAVE 18.4% STEEL</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-steel-700">
                {recommendations[0].profile}
              </span>
              <span className="text-xs font-mono text-steel-600 font-bold">{recommendations[0].weightKgPerM} kg/m</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-cyanAccent-200">
              <div><span className="text-navy-500">Depth:</span> <span className="font-bold text-navy-800">{recommendations[0].depthMm} mm</span></div>
              <div><span className="text-navy-500">Safety Factor:</span> <span className="font-bold text-emerald-600">{recommendations[0].safetyFactor}</span></div>
              <div><span className="text-navy-500">Cost Savings:</span> <span className="font-bold text-emerald-600">${recommendations[0].costReductionUSD}</span></div>
              <div><span className="text-navy-500">Carbon Saved:</span> <span className="font-bold text-cyanAccent-700">{recommendations[0].carbonReductionKg} kg CO₂</span></div>
            </div>

            <Button
              variant="accent"
              size="md"
              className="w-full justify-center mt-2 shadow-glow-cyan"
              icon="check_circle"
              onClick={() => handleApply(recommendations[0])}
            >
              Accept & Apply Section {recommendations[0].profile}
            </Button>
          </div>
        </div>
      </div>

      {/* Alternative Recommendations Grid */}
      <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
        <h3 className="font-heading font-bold text-base text-navy-800">
          Alternative AI Candidate Sections
        </h3>

        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 bg-concrete-50 hover:bg-steel-50/50 rounded border border-concrete-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-heading font-bold text-lg text-navy-900">{rec.profile}</span>
                  <Badge variant={idx === 0 ? 'cyan' : 'steel'} size="sm">{rec.status}</Badge>
                </div>
                <p className="text-xs text-navy-600 leading-relaxed font-body">
                  {rec.reasoning}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-navy-500 pt-1">
                  <span>Weight: <strong className="text-navy-800">{rec.weightKgPerM} kg/m</strong></span>
                  <span>Safety Factor: <strong className="text-emerald-600">{rec.safetyFactor}</strong></span>
                  <span>Savings: <strong className="text-cyanAccent-700">{rec.weightSavingPercent}%</strong></span>
                </div>
              </div>

              <Button
                variant={idx === 0 ? 'accent' : 'outline'}
                size="sm"
                icon="check"
                onClick={() => handleApply(rec)}
              >
                Select {rec.profile}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="AI Recommendation Applied"
        subtitle={`Beam B-104 updated to section ${selectedRec?.profile}`}
        icon="check_circle"
        primaryActionText="Go to Analysis Dashboard"
        onPrimaryAction={() => {
          setIsSuccessModalOpen(false);
          navigate('/analysis');
        }}
      >
        <div className="space-y-3 text-xs text-navy-700">
          <p>
            Section <strong className="font-mono text-steel-700">{selectedRec?.profile}</strong> has been successfully adopted for Beam B-104 transfer girder.
          </p>
          <div className="p-3 bg-cyanAccent-50 rounded border border-cyanAccent-200 font-mono text-cyanAccent-900 space-y-1">
            <div>• Steel Weight Reduced: {selectedRec?.weightSavingPercent}%</div>
            <div>• Cost Savings: ${selectedRec?.costReductionUSD}</div>
            <div>• Carbon Emissions Prevented: {selectedRec?.carbonReductionKg} kg CO₂</div>
            <div>• Updated AISC Safety Factor: {selectedRec?.safetyFactor}</div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
