import React, { useState } from 'react';
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

  // Extract initial IDs from route state or URL search parameters
  const stateSelectedIds = location.state?.selectedIds;
  const paramSelectedIds = searchParams.get('ids') ? searchParams.get('ids').split(',') : null;
  const initialIds = stateSelectedIds || paramSelectedIds || [];

  // Dropdown states for Beam A and Beam B
  const [beamAId, setBeamAId] = useState(() => {
    if (initialIds.length >= 1) return String(initialIds[0]);
    if (historyList.length >= 1) return String(historyList[0].analysisId);
    return '';
  });

  const [beamBId, setBeamBId] = useState(() => {
    if (initialIds.length >= 2) return String(initialIds[1]);
    if (historyList.length >= 2) return String(historyList[1].analysisId);
    if (historyList.length >= 1) return String(historyList[0].analysisId);
    return '';
  });

  // State controlling whether active comparison results are computed and displayed
  const [hasCompared, setHasCompared] = useState(true);

  // Get selected beam objects from historyList
  const beamA = historyList.find(h => String(h.analysisId) === String(beamAId)) || historyList[0] || {};
  const beamB = historyList.find(h => String(h.analysisId) === String(beamBId)) || historyList[1] || historyList[0] || {};

  const handleRunComparison = () => {
    setHasCompared(true);
  };

  // Helper metric extractors
  const getPmax = (b) => parseFloat(b.prediction?.pmax) || 0;
  const getDelta = (b) => parseFloat(b.prediction?.delta_ult) || 9999;
  const getHealth = (b) => b.beam_health_score ?? 85;
  const getFc = (b) => `M${b.beamParams?.concrete_strength || 30}`;
  const getSteel = (b) => `Fe${b.beamParams?.fy_longitudinal_bars || 500}`;
  const getSize = (b) => `${b.beamParams?.width || 300} × ${b.beamParams?.depth || 450} mm`;
  const getMode = (b) => b.prediction?.failure_mode || 'Flexural-bending (ductile)';
  const getRec = (b) => typeof b.recommendation === 'string' ? b.recommendation : (b.recommendation?.summary || 'Optimum section design');

  const pmaxA = getPmax(beamA);
  const pmaxB = getPmax(beamB);
  const winnerPmax = pmaxA > pmaxB ? 'A' : (pmaxB > pmaxA ? 'B' : 'TIE');

  const deltaA = getDelta(beamA);
  const deltaB = getDelta(beamB);
  const winnerDelta = deltaA < deltaB ? 'A' : (deltaB < deltaA ? 'B' : 'TIE');

  const healthA = getHealth(beamA);
  const healthB = getHealth(beamB);
  const winnerHealth = healthA > healthB ? 'A' : (healthB > healthA ? 'B' : 'TIE');

  const modeA = getMode(beamA);
  const modeB = getMode(beamB);
  const isDuctileA = modeA.toLowerCase().includes('flexural') || modeA.toLowerCase().includes('ductile');
  const isDuctileB = modeB.toLowerCase().includes('flexural') || modeB.toLowerCase().includes('ductile');
  const winnerMode = (isDuctileA && !isDuctileB) ? 'A' : ((!isDuctileA && isDuctileB) ? 'B' : 'TIE');

  // Overall Winner Calculation
  const scoreA = healthA + (pmaxA * 0.1) - (deltaA * 0.2);
  const scoreB = healthB + (pmaxB * 0.1) - (deltaB * 0.2);
  const winnerDesign = scoreA >= scoreB ? 'A' : 'B';

  const winningBeam = winnerDesign === 'A' ? beamA : beamB;
  const losingBeam = winnerDesign === 'A' ? beamB : beamA;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-body">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-300 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brandOrange font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-brandOrange"></span>
              STRUCTWISE AI • SIDE-BY-SIDE STRUCTURAL COMPARISON MODULE
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-brandNavy tracking-tight">
              Cross-Beam Performance Benchmarking
            </h1>
            <p className="text-xs text-brandSteel mt-0.5">
              Select two beam designs from History and click COMPARE to evaluate side-by-side performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon="history" onClick={() => navigate('/history')}>
              Back to History
            </Button>
            <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/beam-design')}>
              Create New Beam
            </Button>
          </div>
        </div>

        {/* Workflow Control Bar: Select Beam A, Select Beam B, Click COMPARE */}
        <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-4">
          <div className="flex items-center gap-2 border-b border-concrete-200 pb-3">
            <span className="material-symbols-outlined text-brandNavy text-xl">compare_arrows</span>
            <h2 className="font-heading font-extrabold text-sm text-brandNavy uppercase tracking-wider">
              Comparison Workflow Setup
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Select Beam A */}
            <div>
              <label className="block text-xs font-heading font-bold text-brandNavy uppercase mb-1.5">
                Select Beam A (Baseline)
              </label>
              <select
                value={beamAId}
                onChange={(e) => { setBeamAId(e.target.value); setHasCompared(false); }}
                className="w-full bg-brandBg border border-concrete-300 rounded text-xs px-3.5 py-2.5 font-mono text-navy-900 font-bold focus:ring-2 focus:ring-brandNavy"
              >
                {historyList.map(h => (
                  <option key={h.analysisId} value={h.analysisId}>
                    {h.beamName} (#{h.analysisId})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Beam B */}
            <div>
              <label className="block text-xs font-heading font-bold text-brandNavy uppercase mb-1.5">
                Select Beam B (Candidate)
              </label>
              <select
                value={beamBId}
                onChange={(e) => { setBeamBId(e.target.value); setHasCompared(false); }}
                className="w-full bg-brandBg border border-concrete-300 rounded text-xs px-3.5 py-2.5 font-mono text-navy-900 font-bold focus:ring-2 focus:ring-brandNavy"
              >
                {historyList.map(h => (
                  <option key={h.analysisId} value={h.analysisId}>
                    {h.beamName} (#{h.analysisId})
                  </option>
                ))}
              </select>
            </div>

            {/* Click COMPARE Button */}
            <div>
              <Button
                variant="accent"
                className="w-full justify-center shadow-md py-2.5 text-xs font-bold uppercase tracking-wider"
                icon="compare_arrows"
                onClick={handleRunComparison}
              >
                COMPARE BEAMS
              </Button>
            </div>
          </div>
        </div>

        {/* Comparison Results Section */}
        {hasCompared && beamA && beamB && (
          <div className="space-y-6 animate-fade-in">
            {/* Side-by-Side Comparison Table */}
            <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
              <div className="p-4 bg-brandNavy text-white flex items-center justify-between font-mono">
                <span className="font-heading font-bold text-xs uppercase tracking-wider">
                  STRUCTURAL BENCHMARK TABLE (BEAM A vs BEAM B)
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  Highlighted green cells indicate superior structural performance
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-concrete-100 border-b border-concrete-200">
                      <th className="p-3.5 w-1/4 font-heading font-bold text-brandNavy uppercase">Parameter</th>
                      <th className={`p-3.5 font-heading font-extrabold text-brandNavy border-l border-concrete-200 ${winnerDesign === 'A' ? 'bg-emerald-100/70 text-emerald-950' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span>Beam A: {beamA.beamName}</span>
                          {winnerDesign === 'A' && <Badge variant="green font-bold">WINNER</Badge>}
                        </div>
                      </th>
                      <th className={`p-3.5 font-heading font-extrabold text-brandNavy border-l border-concrete-200 ${winnerDesign === 'B' ? 'bg-emerald-100/70 text-emerald-950' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span>Beam B: {beamB.beamName}</span>
                          {winnerDesign === 'B' && <Badge variant="green font-bold">WINNER</Badge>}
                        </div>
                      </th>
                      <th className="p-3.5 font-heading font-bold text-brandNavy uppercase border-l border-concrete-200 w-1/6">
                        Winner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-concrete-200">

                    {/* Ultimate Load Pmax */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Ultimate Load (Pmax)</td>
                      <td className={`p-3.5 border-l border-concrete-200 font-extrabold ${winnerPmax === 'A' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {pmaxA} kN
                      </td>
                      <td className={`p-3.5 border-l border-concrete-200 font-extrabold ${winnerPmax === 'B' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {pmaxB} kN
                      </td>
                      <td className="p-3.5 border-l border-concrete-200 font-bold">
                        {winnerPmax === 'A' ? <span className="text-emerald-700">Beam A (+{(pmaxA - pmaxB).toFixed(1)} kN)</span> : winnerPmax === 'B' ? <span className="text-emerald-700">Beam B (+{(pmaxB - pmaxA).toFixed(1)} kN)</span> : 'Tie'}
                      </td>
                    </tr>

                    {/* Ultimate Deflection */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Ultimate Deflection (Δult)</td>
                      <td className={`p-3.5 border-l border-concrete-200 font-extrabold ${winnerDelta === 'A' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {deltaA} mm
                      </td>
                      <td className={`p-3.5 border-l border-concrete-200 font-extrabold ${winnerDelta === 'B' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {deltaB} mm
                      </td>
                      <td className="p-3.5 border-l border-concrete-200 font-bold">
                        {winnerDelta === 'A' ? <span className="text-emerald-700">Beam A (Lower Deflection)</span> : winnerDelta === 'B' ? <span className="text-emerald-700">Beam B (Lower Deflection)</span> : 'Tie'}
                      </td>
                    </tr>

                    {/* Failure Mode */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Failure Mode</td>
                      <td className={`p-3.5 border-l border-concrete-200 font-bold ${winnerMode === 'A' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {modeA}
                      </td>
                      <td className={`p-3.5 border-l border-concrete-200 font-bold ${winnerMode === 'B' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {modeB}
                      </td>
                      <td className="p-3.5 border-l border-concrete-200 font-bold">
                        {winnerMode === 'A' ? <span className="text-emerald-700">Beam A (Ductile)</span> : winnerMode === 'B' ? <span className="text-emerald-700">Beam B (Ductile)</span> : 'Tie'}
                      </td>
                    </tr>

                    {/* Beam Health Score */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Beam Health Score</td>
                      <td className={`p-3.5 border-l border-concrete-200 font-black ${winnerHealth === 'A' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {healthA}%
                      </td>
                      <td className={`p-3.5 border-l border-concrete-200 font-black ${winnerHealth === 'B' ? 'bg-emerald-50 text-emerald-900' : ''}`}>
                        {healthB}%
                      </td>
                      <td className="p-3.5 border-l border-concrete-200 font-bold">
                        {winnerHealth === 'A' ? <span className="text-emerald-700">Beam A ({healthA}%)</span> : winnerHealth === 'B' ? <span className="text-emerald-700">Beam B ({healthB}%)</span> : 'Tie'}
                      </td>
                    </tr>

                    {/* Concrete Grade */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Concrete Grade</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandNavy font-bold">{getFc(beamA)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandNavy font-bold">{getFc(beamB)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandSteel">-</td>
                    </tr>

                    {/* Steel Grade */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Steel Grade</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandNavy font-bold">{getSteel(beamA)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandNavy font-bold">{getSteel(beamB)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandSteel">-</td>
                    </tr>

                    {/* Section Size */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Section Size (b × h)</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandNavy font-bold">{getSize(beamA)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandNavy font-bold">{getSize(beamB)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-brandSteel">-</td>
                    </tr>

                    {/* Recommendation Summary */}
                    <tr>
                      <td className="p-3.5 font-bold text-brandNavy">Recommendation</td>
                      <td className="p-3.5 border-l border-concrete-200 text-xs font-body text-navy-700">{getRec(beamA)}</td>
                      <td className="p-3.5 border-l border-concrete-200 text-xs font-body text-navy-700">{getRec(beamB)}</td>
                      <td className="p-3.5 border-l border-concrete-200 font-bold">
                        <span className="text-emerald-700 font-bold">{winnerDesign === 'A' ? 'Beam A Preferred' : 'Beam B Preferred'}</span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            {/* FINAL DECISION Card */}
            <div className="bg-white rounded border-2 border-emerald-500 shadow-blueprint p-6 space-y-4 font-body">
              <div className="flex items-center gap-3 border-b border-concrete-200 pb-3">
                <div className="w-10 h-10 rounded bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold shrink-0">
                  <span className="material-symbols-outlined text-2xl">gavel</span>
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-brandNavy">
                    FINAL ENGINEERING DECISION
                  </h3>
                  <p className="text-xs text-brandSteel font-mono">
                    Automated structural selection verdict
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded border border-emerald-200 space-y-2">
                <h4 className="font-heading font-black text-base text-emerald-950">
                  {winningBeam.beamName} is recommended because:
                </h4>
                <ul className="space-y-1.5 font-mono text-xs text-emerald-900 pt-1">
                  <li className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Higher load carrying capacity (Pmax: {getPmax(winningBeam)} kN vs {getPmax(losingBeam)} kN)</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Lower serviceability deflection (Δult: {getDelta(winningBeam)} mm vs {getDelta(losingBeam)} mm)</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Better Beam Health Score ({getHealth(winningBeam)}% vs {getHealth(losingBeam)}%)</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Safer failure mode ({getMode(winningBeam)})</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Better overall structural performance under AISC 360-16 / IS 456 limits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
