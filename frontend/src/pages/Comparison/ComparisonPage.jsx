import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAnalysis } from '../../context/AnalysisContext';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { historyList } = useAnalysis();

  const [selectedIds, setSelectedIds] = useState(() => {
    return historyList.slice(0, 2).map(h => String(h.analysisId));
  });

  const toggleSelectBeam = (id) => {
    const sId = String(id);
    if (selectedIds.includes(sId)) {
      if (selectedIds.length <= 1) return;
      setSelectedIds(selectedIds.filter(i => i !== sId));
    } else {
      if (selectedIds.length >= 3) return;
      setSelectedIds([...selectedIds, sId]);
    }
  };

  const comparedBeams = historyList.filter(h => selectedIds.includes(String(h.analysisId)));

  if (historyList.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyanAccent-50 border border-cyanAccent-200 flex items-center justify-center text-cyanAccent-600 mx-auto">
              <span className="material-symbols-outlined text-3xl">compare_arrows</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">No analyses available for comparison</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Run analyses on at least two beam sections to compare their structural capacities side-by-side.
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

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-300 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-steel-500"></span>
              MULTI-SECTION COMPARATIVE MATRIX
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
              Cross-Beam Performance Comparison
            </h1>
            <p className="text-xs text-navy-500 mt-0.5">
              Side-by-side benchmarking of predictions across saved analysis runs.
            </p>
          </div>

          <Button variant="accent" icon="play_arrow" onClick={() => navigate('/analysis')}>
            Run New Analysis
          </Button>
        </div>

        {/* Selection Bar */}
        <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-3">
          <span className="text-xs font-mono font-bold text-navy-800 uppercase block">
            Select Up to 3 Saved Analyses to Compare:
          </span>
          <div className="flex flex-wrap gap-2">
            {historyList.map(item => {
              const sId = String(item.analysisId);
              const isSelected = selectedIds.includes(sId);
              return (
                <button
                  key={sId}
                  onClick={() => toggleSelectBeam(sId)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition ${
                    isSelected
                      ? 'bg-steel-600 text-white border-steel-700 shadow'
                      : 'bg-concrete-50 text-navy-800 border-concrete-300 hover:bg-concrete-100'
                  }`}
                >
                  {item.beamName} (#{item.analysisId})
                </button>
              );
            })}
          </div>
        </div>

        {/* Side by Side Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedBeams.map((beam) => (
            <div key={beam.analysisId} className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-navy-900">{beam.beamName}</h3>
                  <p className="text-[10px] font-mono text-navy-400">Analysis #{beam.analysisId}</p>
                </div>
                <Badge variant={beam.beam_health_score >= 80 ? 'green' : 'cyan'}>
                  {beam.beam_health_score}% HEALTH
                </Badge>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-concrete-50 rounded border border-concrete-200 flex justify-between items-center">
                  <span className="text-navy-500 uppercase text-[10px]">Pmax Capacity</span>
                  <span className="font-bold text-navy-900 text-base">{beam.prediction?.pmax ?? '--'} kN</span>
                </div>
                <div className="p-3 bg-concrete-50 rounded border border-concrete-200 flex justify-between items-center">
                  <span className="text-navy-500 uppercase text-[10px]">Δult Deflection</span>
                  <span className="font-bold text-navy-900 text-base">{beam.prediction?.delta_ult ?? '--'} mm</span>
                </div>
                <div className="p-3 bg-concrete-50 rounded border border-concrete-200 flex justify-between items-center">
                  <span className="text-navy-500 uppercase text-[10px]">Failure Mode</span>
                  <span className="font-bold text-navy-900">{beam.prediction?.failure_mode ?? 'Flexural'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-concrete-200 text-[11px] text-navy-600 font-body">
                <span className="font-bold text-navy-900 block mb-1">Recommendation:</span>
                <p className="line-clamp-3">{beam.recommendation}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
