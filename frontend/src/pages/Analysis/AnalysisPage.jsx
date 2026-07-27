import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MetricCard from '../../components/common/MetricCard';
import fetchApi from '../../services/api';
import { sampleBeamCalculations } from '../../services/mockData';

// Circular Radial Gauge Component for Beam Health Score
function HealthGauge({ score = 91, status = 'PASS' }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-emerald-500";
  let bgTrack = "text-emerald-100";
  let statusBg = "bg-emerald-500/10 text-emerald-700 border-emerald-300";

  if (score < 60 || status === 'FAIL') {
    colorClass = "text-red-500";
    bgTrack = "text-red-100";
    statusBg = "bg-red-500/10 text-red-700 border-red-300";
  } else if (score < 80 || status === 'WARNING') {
    colorClass = "text-amber-500";
    bgTrack = "text-amber-100";
    statusBg = "bg-amber-500/10 text-amber-700 border-amber-300";
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-concrete-300 rounded shadow-blueprint">
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${bgTrack} stroke-current`}
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-heading font-black text-navy-900 leading-none">
            {score}%
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-navy-500 mt-1">
            Health Score
          </span>
        </div>
      </div>

      <div className="space-y-3 text-center sm:text-left flex-1">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-mono uppercase font-bold text-navy-500">Overall Assessment</span>
          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${statusBg}`}>
            {status}
          </span>
        </div>
        <h3 className="text-lg font-heading font-bold text-navy-900">
          {score >= 80 ? 'Structural Integrity Passed' : score >= 60 ? 'Structural Review Advised' : 'Critical Deficiencies Found'}
        </h3>
        <p className="text-xs text-navy-600 leading-relaxed max-w-lg font-body">
          Weighted evaluation: Ultimate Load Capacity (40%), Ductility Ratio (25%), Energy Dissipation (20%), and Ductile Flexural Failure Mode (15%).
        </p>

        {/* Progress Breakdown Bar */}
        <div className="w-full bg-concrete-200 h-2 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, score)}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const beamId = queryParams.get('beamId') || 'default';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(`/analysis/${beamId}`);
      setData(res);
    } catch (err) {
      if (err.message?.includes('No beams found') || err.message?.includes('Beam not found')) {
        // Fallback to rich mock evaluation data for interactive demo
        setData({
          beam: {
            id: sampleBeamCalculations.id,
            name: sampleBeamCalculations.name,
            project_id: sampleBeamCalculations.projectId,
            geometry: sampleBeamCalculations.geometry
          },
          predictions: {
            ultimateLoad: 285.4,
            deflection: 7.2,
            ductility: 3.8,
            energy: 1620,
            failureMode: "Flexure"
          },
          evaluation: {
            beamHealth: 91,
            overallStatus: "PASS",
            ultimateLoadStatus: "PASS",
            deflectionStatus: "PASS",
            ductilityStatus: "GOOD",
            energyStatus: "EXCELLENT",
            failureStatus: "PREFERRED"
          },
          analysis: {
            healthScore: 91,
            ultimateLoad: 285.4,
            predictedDeflection: 7.2,
            safetyFactor: 1.48
          },
          prediction: {
            status: "COMPLETED",
            confidenceScore: "95.2%",
            failureMode: "Flexure",
            performanceClassification: "PASS"
          },
          recommendations: [
            {
              title: "Optimize Section Material Weight",
              description: "Structural design fully satisfies AISC / Eurocode ULS and SLS limit states. Section depth can be optimized to save 12% steel weight.",
              expectedBenefit: "12% Weight & Carbon Reduction",
              priority: "Low",
              icon: "verified"
            },
            {
              title: "Provide Secondary Shear Ties",
              description: "Maintain stirrup spacing at 150 mm near supports to ensure long-term hysteretic energy dissipation.",
              expectedBenefit: "+10% Seismic Resiliency",
              priority: "Medium",
              icon: "layers"
            }
          ],
          history: [
            { analysisId: 101, timestamp: '2026-07-25 12:40', status: 'COMPLETED', version: 'v1.0', health: 91 }
          ]
        });
      } else {
        setError(err.message || 'Failed to load structural evaluation data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [beamId]);

  const handleRunAnalysis = async () => {
    setRunningAnalysis(true);
    try {
      if (data?.beam?.id === sampleBeamCalculations.id) {
        // Interactive simulated evaluation run for demo beam
        setData(prev => ({
          ...prev,
          prediction: { ...prev.prediction, status: 'RUNNING' }
        }));
        setTimeout(() => {
          setData(prev => ({
            ...prev,
            prediction: { ...prev.prediction, status: 'COMPLETED' },
            evaluation: {
              beamHealth: 94,
              overallStatus: "PASS",
              ultimateLoadStatus: "PASS",
              deflectionStatus: "PASS",
              ductilityStatus: "EXCELLENT",
              energyStatus: "EXCELLENT",
              failureStatus: "PREFERRED"
            },
            predictions: {
              ultimateLoad: 298.5,
              deflection: 6.8,
              ductility: 4.2,
              energy: 1750,
              failureMode: "Flexure"
            }
          }));
          setRunningAnalysis(false);
        }, 1200);
        return;
      }

      // Live backend workflow
      setData(prev => ({
        ...prev,
        prediction: { ...prev.prediction, status: 'RUNNING' }
      }));
      await fetchApi(`/analysis/${beamId}/run`, { method: 'POST' });
      await fetchAnalysis();
    } catch (err) {
      setError(err.message || 'Error executing structural evaluation');
      await fetchAnalysis();
    } finally {
      setRunningAnalysis(false);
    }
  };

  if (loading && !data) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-steel-200 border-t-steel-500 rounded-full animate-spin"></div>
            <p className="text-navy-500 font-mono text-sm">Evaluating Structural Capacity & Limit States...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error && !data) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded text-center space-y-4">
          <span className="material-symbols-outlined text-4xl">error</span>
          <h2 className="font-heading font-bold text-lg">Evaluation Error</h2>
          <p className="text-sm">{error}</p>
          <Button variant="outline" onClick={fetchAnalysis}>Retry</Button>
        </div>
      </MainLayout>
    );
  }

  const { beam, predictions, evaluation, prediction, recommendations, history } = data || {};
  const isRunning = prediction?.status === 'RUNNING' || runningAnalysis;
  const isCompleted = prediction?.status === 'COMPLETED';

  // Helper for Status Badge styling
  const getBadgeVariant = (val) => {
    if (!val) return 'steel';
    const v = val.toUpperCase();
    if (v === 'PASS' || v === 'EXCELLENT' || v === 'PREFERRED') return 'green';
    if (v === 'WARNING' || v === 'GOOD' || v === 'MODERATE') return 'cyan';
    if (v === 'FAIL' || v === 'POOR' || v === 'CRITICAL') return 'red';
    return 'steel';
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-concrete-300 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              MODULE 5 & 6 • STRUCTURAL EVALUATION & AI RECOMMENDATIONS
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-navy-900 tracking-tight">
              {beam?.name || 'Reinforced Concrete Beam Analysis'}
            </h1>
            <p className="text-xs text-navy-500 mt-1 font-mono">
              Project ID: {beam?.project_id || 'PRJ-2026-001'} • Code: AISC 360-16 / Eurocode 2
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" icon="refresh" onClick={fetchAnalysis} disabled={isRunning}>
              Refresh
            </Button>
            <Button variant="outline" icon="download" onClick={() => navigate('/reports')}>
              Export Report PDF
            </Button>
            <Button 
              variant="accent" 
              icon={isRunning ? "hourglass_empty" : "play_arrow"}
              onClick={handleRunAnalysis}
              disabled={isRunning}
            >
              {isRunning ? 'Running Engine...' : 'Run Evaluation Engine'}
            </Button>
          </div>
        </div>

        {/* Top Health Score Radial Widget */}
        <HealthGauge 
          score={evaluation?.beamHealth ?? (isCompleted ? 91 : 0)} 
          status={evaluation?.overallStatus || (isCompleted ? 'PASS' : 'NOT STARTED')} 
        />

        {/* Prediction & Evaluation Metric Cards */}
        <section className="space-y-4">
          <h2 className="text-sm font-heading font-bold text-navy-800 uppercase tracking-wider border-l-4 border-steel-500 pl-3">
            Predicted Metrics & Limit State Evaluations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Ultimate Load */}
            <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase text-navy-500">Ultimate Load (Pmax)</span>
                <Badge variant={getBadgeVariant(evaluation?.ultimateLoadStatus)}>{evaluation?.ultimateLoadStatus || 'N/A'}</Badge>
              </div>
              <div className="text-2xl font-heading font-black text-navy-900">
                {predictions?.ultimateLoad ? `${predictions.ultimateLoad} kN` : '—'}
              </div>
              <div className="text-[11px] text-navy-500 font-mono">Capacity Limit: &gt; 250 kN</div>
            </div>

            {/* Ultimate Deflection */}
            <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase text-navy-500">Deflection (Δult)</span>
                <Badge variant={getBadgeVariant(evaluation?.deflectionStatus)}>{evaluation?.deflectionStatus || 'N/A'}</Badge>
              </div>
              <div className="text-2xl font-heading font-black text-navy-900">
                {predictions?.deflection ? `${predictions.deflection} mm` : '—'}
              </div>
              <div className="text-[11px] text-navy-500 font-mono">Limit: &lt; 10 mm (L/360)</div>
            </div>

            {/* Ductility Factor */}
            <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase text-navy-500">Ductility (μ)</span>
                <Badge variant={getBadgeVariant(evaluation?.ductilityStatus)}>{evaluation?.ductilityStatus || 'N/A'}</Badge>
              </div>
              <div className="text-2xl font-heading font-black text-navy-900">
                {predictions?.ductility ? `${predictions.ductility}` : '—'}
              </div>
              <div className="text-[11px] text-navy-500 font-mono">Target: &gt; 4.0 Excellent</div>
            </div>

            {/* Energy Dissipation */}
            <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase text-navy-500">Energy (E)</span>
                <Badge variant={getBadgeVariant(evaluation?.energyStatus)}>{evaluation?.energyStatus || 'N/A'}</Badge>
              </div>
              <div className="text-2xl font-heading font-black text-navy-900">
                {predictions?.energy ? `${predictions.energy} J` : '—'}
              </div>
              <div className="text-[11px] text-navy-500 font-mono">Target: &gt; 1500 J</div>
            </div>

            {/* Failure Mode */}
            <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase text-navy-500">Failure Mode</span>
                <Badge variant={getBadgeVariant(evaluation?.failureStatus)}>{evaluation?.failureStatus || 'N/A'}</Badge>
              </div>
              <div className="text-xl font-heading font-extrabold text-navy-900 truncate">
                {predictions?.failureMode || '—'}
              </div>
              <div className="text-[11px] text-navy-500 font-mono">Behavior: Ductile Flexure</div>
            </div>

          </div>
        </section>

        {/* Module 6: Rule-Based AI Recommendation Engine Panel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading font-bold text-navy-800 uppercase tracking-wider border-l-4 border-cyanAccent-500 pl-3">
              Module 6 • Rule-Based AI Recommendations
            </h2>
            <span className="text-xs font-mono text-navy-500">Automated Design Suggestions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((rec, idx) => {
                let priorityVariant = "steel";
                if (rec.priority === "High") priorityVariant = "red";
                else if (rec.priority === "Medium") priorityVariant = "cyan";

                return (
                  <div key={idx} className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-3 hover:border-steel-400 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-navy-50 rounded border border-navy-100 text-steel-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">{rec.icon || 'tips_and_updates'}</span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-navy-900">{rec.title}</h4>
                      </div>
                      <Badge variant={priorityVariant}>{rec.priority || 'Medium'} Priority</Badge>
                    </div>

                    <p className="text-xs text-navy-600 font-body leading-relaxed">
                      {rec.description}
                    </p>

                    {rec.expectedBenefit && (
                      <div className="pt-2 border-t border-concrete-200 flex items-center gap-2 text-xs font-mono text-emerald-700">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>Expected Benefit: <strong>{rec.expectedBenefit}</strong></span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 bg-white border border-concrete-300 p-8 rounded text-center text-navy-400 font-mono text-sm">
                No recommendations generated. Run the evaluation engine to assess structural design.
              </div>
            )}
          </div>
        </section>

        {/* History Audit Log */}
        <section className="space-y-4">
          <h2 className="text-sm font-heading font-bold text-navy-800 uppercase tracking-wider border-l-4 border-steel-500 pl-3">
            Execution History & Audit Log
          </h2>

          <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-navy-50 font-heading font-bold text-navy-700 uppercase border-b border-concrete-200">
                <tr>
                  <th className="p-3">Run Timestamp</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Beam Health Score</th>
                  <th className="p-3">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200 font-mono">
                {history && history.length > 0 ? (
                  history.map((run, idx) => (
                    <tr key={idx} className="hover:bg-concrete-50">
                      <td className="p-3 text-navy-700">{run.timestamp}</td>
                      <td className="p-3 text-navy-500">{run.version}</td>
                      <td className="p-3 font-bold text-navy-900">{run.health ? `${run.health}%` : '—'}</td>
                      <td className="p-3"><Badge variant={getBadgeVariant(run.status)}>{run.status}</Badge></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-navy-400">No previous analysis runs logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
