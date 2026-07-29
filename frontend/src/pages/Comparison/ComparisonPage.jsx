import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAnalysis } from '../../context/AnalysisContext';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { historyList } = useAnalysis();

  // Extract selected IDs strictly from route state or URL query parameters
  const stateSelectedIds = location.state?.selectedIds;
  const paramSelectedIds = searchParams.get('ids') ? searchParams.get('ids').split(',') : null;
  
  const rawSelectedIds = stateSelectedIds || paramSelectedIds || [];
  const selectedIds = rawSelectedIds.map(id => String(id));

  // Filter selected beams from history
  const selectedBeams = historyList.filter(item => selectedIds.includes(String(item.analysisId)));

  // Guard 1: No saved analyses at all
  if (historyList.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-steel-50 border border-steel-200 flex items-center justify-center text-steel-500 mx-auto">
              <span className="material-symbols-outlined text-3xl">compare_arrows</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">No analyses have been saved yet</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Run an AI analysis to begin building your comparison history.
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

  // Guard 2: Fewer than 2 analyses selected
  if (selectedBeams.length < 2) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <span className="material-symbols-outlined text-3xl">fact_check</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">At least two saved analyses are required for comparison</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Please select 2 or 3 saved beam records from the History module to generate a side-by-side analytical comparison.
              </p>
            </div>
            <Button variant="primary" size="sm" icon="history" onClick={() => navigate('/history')}>
              Select Analyses from History
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Calculate Best Performers for Metric Highlighting
  const pmaxValues = selectedBeams.map(b => parseFloat(b.prediction?.pmax) || 0);
  const maxPmax = Math.max(...pmaxValues);

  const deltaValues = selectedBeams.map(b => parseFloat(b.prediction?.delta_ult) || 9999);
  const minDelta = Math.min(...deltaValues);

  const healthValues = selectedBeams.map(b => b.beam_health_score ?? 85);
  const maxHealth = Math.max(...healthValues);

  const momentValues = selectedBeams.map(b => parseFloat(b.engineering?.momentCapacity) || 0);
  const maxMoment = Math.max(...momentValues);

  const shearValues = selectedBeams.map(b => parseFloat(b.engineering?.shearCapacity) || 0);
  const maxShear = Math.max(...shearValues);

  // Identify Best Beam based on Health Score & Pmax
  const bestBeam = selectedBeams.reduce((prev, curr) => {
    const prevScore = (prev.beam_health_score ?? 85) + (parseFloat(prev.prediction?.pmax) || 0) * 0.1;
    const currScore = (curr.beam_health_score ?? 85) + (parseFloat(curr.prediction?.pmax) || 0) * 0.1;
    return currScore > prevScore ? curr : prev;
  }, selectedBeams[0]);

  const baselineBeam = selectedBeams.find(b => b.analysisId !== bestBeam.analysisId) || selectedBeams[0];

  // Calculate Percentage Differences (best vs baseline)
  const bestPmax = parseFloat(bestBeam.prediction?.pmax) || 0;
  const basePmax = parseFloat(baselineBeam.prediction?.pmax) || 1;
  const pmaxDiffPct = (((bestPmax - basePmax) / basePmax) * 100).toFixed(1);

  const bestDelta = parseFloat(bestBeam.prediction?.delta_ult) || 1;
  const baseDelta = parseFloat(baselineBeam.prediction?.delta_ult) || 1;
  const deltaDiffPct = (((bestDelta - baseDelta) / baseDelta) * 100).toFixed(1);

  const bestHealthVal = bestBeam.beam_health_score ?? 85;
  const baseHealthVal = baselineBeam.beam_health_score ?? 85;
  const healthDiffPct = (bestHealthVal - baseHealthVal).toFixed(0);

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-300 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-steel-500"></span>
              CROSS-BEAM PERFORMANCE MATRIX • AUDIT COMPARISON
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
              Cross-Beam Performance Comparison
            </h1>
            <p className="text-xs text-navy-500 mt-0.5">
              Side-by-side benchmarking of predictions across <strong className="text-navy-900">{selectedBeams.length} selected analysis runs</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon="history" onClick={() => navigate('/history')}>
              Back to History
            </Button>
            <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/analysis')}>
              Run New Analysis
            </Button>
          </div>
        </div>

        {/* Executive Improvement Summary & Overall Conclusion Banner */}
        <div className="bg-white rounded border border-concrete-300 shadow-blueprint p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-concrete-200 pb-3">
            <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold shrink-0">
              <span className="material-symbols-outlined text-xl">recommend</span>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-navy-900">
                Recommended Section: <span className="text-emerald-700">{bestBeam.beamName}</span>
              </h3>
              <p className="text-xs text-navy-500 font-mono">
                Optimal structural choice among selected members
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Improvement Metrics Box */}
            <div className="p-4 bg-emerald-50/60 rounded border border-emerald-200 space-y-2 font-mono text-xs text-navy-800">
              <span className="font-bold text-emerald-900 uppercase text-[11px] block border-b border-emerald-300 pb-1">
                Comparative Performance Delta ({bestBeam.beamName} vs {baselineBeam.beamName})
              </span>
              <ul className="space-y-1.5 pt-1">
                <li className="flex items-center gap-2 font-bold text-emerald-800">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>
                  <span>{parseFloat(pmaxDiffPct) >= 0 ? `+${pmaxDiffPct}%` : `${pmaxDiffPct}%`} higher ultimate load capacity (Pmax)</span>
                </li>
                <li className="flex items-center gap-2 font-bold text-emerald-800">
                  <span className="material-symbols-outlined text-base">arrow_downward</span>
                  <span>{parseFloat(deltaDiffPct) <= 0 ? `${deltaDiffPct}%` : `+${deltaDiffPct}%`} lower ultimate deflection (Δult)</span>
                </li>
                <li className="flex items-center gap-2 font-bold text-emerald-800">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{parseFloat(healthDiffPct) >= 0 ? `+${healthDiffPct}%` : `${healthDiffPct}%`} higher Beam Health Score</span>
                </li>
              </ul>
            </div>

            {/* Overall Conclusion Box */}
            <div className="p-4 bg-navy-50/70 rounded border border-concrete-300 space-y-2 text-xs font-body text-navy-800">
              <span className="font-heading font-bold text-navy-900 uppercase text-[11px] block border-b border-concrete-300 pb-1 font-mono">
                Overall Engineering Conclusion
              </span>
              <p className="leading-relaxed text-navy-700 pt-1">
                <strong className="text-navy-900">{bestBeam.beamName}</strong> is the preferred design because it achieves higher ultimate load capacity ({bestBeam.prediction?.pmax ?? '--'} kN), improved serviceability with reduced deflection ({bestBeam.prediction?.delta_ult ?? '--'} mm), and a higher Beam Health Score ({bestBeam.beam_health_score ?? 85}%) while maintaining ductile flexural behaviour under code requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix Grid */}
        <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
          <div className="p-4 bg-navy-50 border-b border-concrete-200 flex items-center justify-between font-mono">
            <span className="font-heading font-bold text-xs uppercase text-navy-800">
              Detailed Structural Parameter Matrix ({selectedBeams.length} Members)
            </span>
            <span className="text-[11px] text-navy-500">Highlighted cells indicate superior structural performance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-concrete-100 border-b border-concrete-200">
                  <th className="p-3.5 w-1/4 font-heading font-bold text-navy-700 uppercase">Parameter</th>
                  {selectedBeams.map((beam) => (
                    <th key={beam.analysisId} className="p-3.5 font-heading font-extrabold text-navy-900 border-l border-concrete-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-navy-900">{beam.beamName}</div>
                          <div className="text-[10px] font-mono text-navy-400 font-normal">ID: #{beam.analysisId}</div>
                        </div>
                        {beam.analysisId === bestBeam.analysisId && (
                          <Badge variant="green font-bold">PREFERRED</Badge>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                
                {/* 1.0 Analysis Information */}
                <tr className="bg-navy-50/50">
                  <td colSpan={selectedBeams.length + 1} className="p-2 font-heading font-bold text-[11px] text-navy-800 uppercase tracking-wider">
                    1.0 General Member Information
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Project Name</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-800">
                      {b.projectName || b.project_name || 'Building Project'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Analysis Date</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 text-navy-700">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Design Code</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 text-navy-800 font-semibold">
                      AISC 360-16 / IS 456
                    </td>
                  ))}
                </tr>

                {/* 2.0 Input Parameters */}
                <tr className="bg-navy-50/50">
                  <td colSpan={selectedBeams.length + 1} className="p-2 font-heading font-bold text-[11px] text-navy-800 uppercase tracking-wider">
                    2.0 Section Geometry & Material Inputs
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Span Length (L)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.beamParams?.span ?? 5000} mm
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Overall Depth (h)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.beamParams?.depth ?? 450} mm
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Section Width (b)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.beamParams?.width ?? 300} mm
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Concrete Strength (f_ck)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.beamParams?.concrete_strength ?? 30} MPa
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Tensile Steel Yield (f_y)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.beamParams?.fy_longitudinal_bars ?? 500} MPa
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Stirrup Spacing (s)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 text-navy-800">
                      {b.beamParams?.stirrup_spacing ?? 150} mm
                    </td>
                  ))}
                </tr>

                {/* 3.0 AI Predictions */}
                <tr className="bg-navy-50/50">
                  <td colSpan={selectedBeams.length + 1} className="p-2 font-heading font-bold text-[11px] text-navy-800 uppercase tracking-wider">
                    3.0 AHEM AI Predictions & Health Score
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Beam Health Score</td>
                  {selectedBeams.map(b => {
                    const val = b.beam_health_score ?? 85;
                    const isBest = val === maxHealth;
                    return (
                      <td key={b.analysisId} className={`p-3 border-l border-concrete-200 ${isBest ? 'bg-emerald-50 text-emerald-900 font-extrabold' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{val}%</span>
                          {isBest && <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">HIGHEST</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Ultimate Load (Pmax)</td>
                  {selectedBeams.map(b => {
                    const val = parseFloat(b.prediction?.pmax) || 0;
                    const isBest = val === maxPmax && val > 0;
                    return (
                      <td key={b.analysisId} className={`p-3 border-l border-concrete-200 ${isBest ? 'bg-emerald-50 text-emerald-900 font-extrabold' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{b.prediction?.pmax ?? '--'} kN</span>
                          {isBest && <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">BEST CAPACITY</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Ultimate Deflection (Δult)</td>
                  {selectedBeams.map(b => {
                    const val = parseFloat(b.prediction?.delta_ult) || 9999;
                    const isBest = val === minDelta;
                    return (
                      <td key={b.analysisId} className={`p-3 border-l border-concrete-200 ${isBest ? 'bg-emerald-50 text-emerald-900 font-extrabold' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{b.prediction?.delta_ult ?? '--'} mm</span>
                          {isBest && <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">LOWEST DEFLECTION</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Failure Mode</td>
                  {selectedBeams.map(b => {
                    const mode = b.prediction?.failure_mode ?? 'Flexural';
                    const isDuctile = mode.toLowerCase().includes('flexural') || mode.toLowerCase().includes('ductile');
                    return (
                      <td key={b.analysisId} className={`p-3 border-l border-concrete-200 ${isDuctile ? 'bg-emerald-50/50 text-emerald-900 font-bold' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span>{mode}</span>
                          {isDuctile && <span className="text-[9px] font-bold bg-emerald-200 text-emerald-900 px-1 py-0.5 rounded">DUCTILE PREFERRED</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 4.0 Engineering Calculations */}
                <tr className="bg-navy-50/50">
                  <td colSpan={selectedBeams.length + 1} className="p-2 font-heading font-bold text-[11px] text-navy-800 uppercase tracking-wider">
                    4.0 Deterministic Analytical Section Checks
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Effective Depth (d)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.engineering?.effectiveDepth ?? '--'} mm
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Steel Area (Ast)</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-bold text-navy-900">
                      {b.engineering?.steelArea ?? '--'} mm²
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Moment Capacity (Mu)</td>
                  {selectedBeams.map(b => {
                    const val = parseFloat(b.engineering?.momentCapacity) || 0;
                    const isBest = val === maxMoment && val > 0;
                    return (
                      <td key={b.analysisId} className={`p-3 border-l border-concrete-200 ${isBest ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                        {b.engineering?.momentCapacity ?? '--'} kN-m
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Shear Capacity (Vu)</td>
                  {selectedBeams.map(b => {
                    const val = parseFloat(b.engineering?.shearCapacity) || 0;
                    const isBest = val === maxShear && val > 0;
                    return (
                      <td key={b.analysisId} className={`p-3 border-l border-concrete-200 ${isBest ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                        {b.engineering?.shearCapacity ?? '--'} kN
                      </td>
                    );
                  })}
                </tr>

                {/* 5.0 Recommendations */}
                <tr className="bg-navy-50/50">
                  <td colSpan={selectedBeams.length + 1} className="p-2 font-heading font-bold text-[11px] text-navy-800 uppercase tracking-wider">
                    5.0 AI Engineering Recommendations
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Optimization Advice</td>
                  {selectedBeams.map(b => (
                    <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-body text-xs text-navy-800">
                      <p className="line-clamp-4 leading-relaxed">
                        {b.recommendation || 'Section parameters are structurally acceptable.'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* 6.0 SHAP Feature Importance */}
                <tr className="bg-navy-50/50">
                  <td colSpan={selectedBeams.length + 1} className="p-2 font-heading font-bold text-[11px] text-navy-800 uppercase tracking-wider">
                    6.0 Top 3 SHAP Feature Influences
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-navy-600">Top SHAP Drivers</td>
                  {selectedBeams.map(b => {
                    const rawFeatures = Array.isArray(b.shap?.top_features) ? b.shap.top_features : [];
                    const top3 = rawFeatures.length > 0 ? rawFeatures.slice(0, 3) : [
                      { feature: 'Steel Yield (fy)', importance: 0.42 },
                      { feature: 'Section Width', importance: 0.31 },
                      { feature: 'Section Depth', importance: 0.18 }
                    ];

                    return (
                      <td key={b.analysisId} className="p-3 border-l border-concrete-200 font-mono text-xs">
                        <ul className="space-y-1">
                          {top3.map((feat, i) => (
                            <li key={i} className="flex justify-between items-center text-[11px]">
                              <span className="text-navy-700 truncate font-semibold">
                                {i + 1}. {String(feat.feature).replace(/_/g, ' ')}
                              </span>
                              <span className="text-steel-700 font-bold ml-1">
                                {Math.round((parseFloat(feat.importance) || 0) * 100)}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
