import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import HealthGauge from '../../components/common/HealthGauge';
import ShapBarChart from '../../components/common/ShapBarChart';
import EnsembleBreakdownTable from '../../components/common/EnsembleBreakdownTable';
import EngineeringMetricsGrid from '../../components/common/EngineeringMetricsGrid';
import RecommendationCard from '../../components/common/RecommendationCard';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { analysisApi } from '../../services/api';
import { useAnalysis } from '../../context/AnalysisContext';

export default function AnalysisPage() {
  return (
    <ErrorBoundary title="Analysis Page Rendering Error">
      <AnalysisPageContent />
    </ErrorBoundary>
  );
}

function AnalysisPageContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeAnalysis, saveAnalysisRun } = useAnalysis();

  const passedParams = location.state?.beamParams;
  const passedBeamName = location.state?.beamName || activeAnalysis?.beamName || 'Beam B-101';

  // Beam Parameter Form State
  const [params, setParams] = useState(passedParams || activeAnalysis?.beamParams || {
    width: 300,
    depth: 450,
    span: 5000,
    concrete_strength: 30,
    num_tensile_bars: 4,
    diameter_tensile_bars: 20,
    tension_reinforcement_ratio: 1.2,
    num_stirrup_legs: 2,
    stirrup_spacing: 150,
    stirrup_diameter: 8,
    fy_longitudinal_bars: 500,
    fy_stirrup_bars: 415
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(activeAnalysis || null);

  useEffect(() => {
    if (location.state?.beamParams) {
      setParams(location.state.beamParams);
    }
  }, [location.state]);

  const applyPreset = (type) => {
    if (type === 'small') {
      setParams({
        width: 200, depth: 300, span: 3000, concrete_strength: 20,
        num_tensile_bars: 2, diameter_tensile_bars: 12, tension_reinforcement_ratio: 0.38,
        num_stirrup_legs: 2, stirrup_spacing: 200, stirrup_diameter: 6,
        fy_longitudinal_bars: 415, fy_stirrup_bars: 250
      });
    } else if (type === 'medium') {
      setParams({
        width: 300, depth: 450, span: 5000, concrete_strength: 30,
        num_tensile_bars: 4, diameter_tensile_bars: 20, tension_reinforcement_ratio: 1.2,
        num_stirrup_legs: 2, stirrup_spacing: 150, stirrup_diameter: 8,
        fy_longitudinal_bars: 500, fy_stirrup_bars: 415
      });
    } else if (type === 'large') {
      setParams({
        width: 450, depth: 750, span: 8000, concrete_strength: 50,
        num_tensile_bars: 8, diameter_tensile_bars: 25, tension_reinforcement_ratio: 1.45,
        num_stirrup_legs: 4, stirrup_spacing: 100, stirrup_diameter: 10,
        fy_longitudinal_bars: 550, fy_stirrup_bars: 500
      });
    }
  };

  const handleInputChange = (field, value) => {
    setParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const runPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analysisApi.predict(params);
      setResult(data);
      saveAnalysisRun(data, passedBeamName, params);
    } catch (err) {
      console.error('Prediction API Error:', err);
      setError(err.message || 'Failed to execute AI structural prediction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [params.width, params.depth, params.span]);

  const getFailureBadgeVariant = (mode) => {
    if (!mode) return 'steel';
    const m = String(mode).toLowerCase();
    if (m.includes('flexur') || m.includes('ductile')) return 'green';
    if (m.includes('shear')) return 'red';
    if (m.includes('compress') || m.includes('over')) return 'cyan';
    return 'steel';
  };

  const healthScore = result?.beam_health_score ?? 0;
  const pmaxVal = result?.prediction?.pmax ?? '--';
  const deltaVal = result?.prediction?.delta_ult ?? '--';
  const failureModeStr = result?.prediction?.failure_mode ?? 'Flexural-bending (ductile)';
  const allowableDeflection = params?.span ? (params.span / 250).toFixed(1) : '--';

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-concrete-300 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              STEP 4 • AI ANALYSIS & PREDICTION
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-navy-900 tracking-tight">
              Analysis - {passedBeamName}
            </h1>
            <p className="text-xs text-navy-500 mt-1 font-mono">
              AISC 360-16 / IS 456 Limit State Checks • SHAP Explainability Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" icon="edit" onClick={() => navigate('/beam-design')}>
              Modify Beam Input
            </Button>
            <Button variant="outline" icon="fact_check" onClick={() => navigate('/evaluation')}>
              View Evaluation →
            </Button>
            <Button
              variant="accent"
              size="lg"
              icon={loading ? "hourglass_empty" : "play_arrow"}
              onClick={runPrediction}
              disabled={loading}
            >
              {loading ? 'Running AI Engine...' : 'Run AI Analysis'}
            </Button>
          </div>
        </div>

        {/* Saved Beam Summary Card */}
        <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
            <div className="flex items-center gap-2 font-heading font-bold text-navy-900 text-sm">
              <span className="material-symbols-outlined text-steel-600">architecture</span>
              Loaded Beam Specifications ({passedBeamName})
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-navy-500">Presets:</span>
              <button onClick={() => applyPreset('small')} className="px-2 py-0.5 text-xs font-mono bg-concrete-100 rounded">Small</button>
              <button onClick={() => applyPreset('medium')} className="px-2 py-0.5 text-xs font-mono bg-concrete-100 rounded">Medium</button>
              <button onClick={() => applyPreset('large')} className="px-2 py-0.5 text-xs font-mono bg-concrete-100 rounded">Large</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 font-mono text-xs">
            <div className="bg-concrete-50 p-2.5 rounded border border-concrete-200">
              <span className="text-[10px] text-navy-400 block uppercase">Width (b)</span>
              <span className="font-bold text-navy-900">{params.width} mm</span>
            </div>
            <div className="bg-concrete-50 p-2.5 rounded border border-concrete-200">
              <span className="text-[10px] text-navy-400 block uppercase">Overall Depth (h)</span>
              <span className="font-bold text-navy-900">{params.depth} mm</span>
            </div>
            <div className="bg-concrete-50 p-2.5 rounded border border-concrete-200">
              <span className="text-[10px] text-navy-400 block uppercase">Span Length (L)</span>
              <span className="font-bold text-navy-900">{params.span} mm</span>
            </div>
            <div className="bg-concrete-50 p-2.5 rounded border border-concrete-200">
              <span className="text-[10px] text-navy-400 block uppercase">Concrete (fck)</span>
              <span className="font-bold text-steel-700">{params.concrete_strength} MPa</span>
            </div>
            <div className="bg-concrete-50 p-2.5 rounded border border-concrete-200">
              <span className="text-[10px] text-navy-400 block uppercase">Tensile Steel</span>
              <span className="font-bold text-steel-700">{params.num_tensile_bars}T{params.diameter_tensile_bars} (fy {params.fy_longitudinal_bars})</span>
            </div>
            <div className="bg-concrete-50 p-2.5 rounded border border-concrete-200">
              <span className="text-[10px] text-navy-400 block uppercase">Stirrups</span>
              <span className="font-bold text-steel-700">{params.num_stirrup_legs}L-T{params.stirrup_diameter} @ {params.stirrup_spacing}mm</span>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white p-12 rounded border border-concrete-300 text-center space-y-4 shadow-blueprint">
            <div className="w-12 h-12 border-4 border-steel-200 border-t-steel-600 rounded-full animate-spin mx-auto"></div>
            <p className="font-heading font-bold text-base text-navy-900">Executing Adaptive Hybrid Ensemble & SHAP Engine...</p>
            <p className="text-xs text-navy-500 font-mono">Running Random Forest, Extra Trees, LightGBM & CatBoost Inference</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded text-center space-y-3">
            <span className="material-symbols-outlined text-3xl">warning</span>
            <h3 className="font-heading font-bold text-base">Prediction Error</h3>
            <p className="text-xs font-mono">{error}</p>
            <Button variant="outline" size="sm" onClick={runPrediction}>Retry Prediction</Button>
          </div>
        )}

        {/* Results Dashboard */}
        {result && !loading && (
          <div className="space-y-8">
            
            {/* Top Health Gauge */}
            <HealthGauge
              score={healthScore}
              status={healthScore >= 85 ? 'PASS' : healthScore >= 70 ? 'WARNING' : 'CRITICAL'}
            />

            {/* AI Prediction Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Pmax */}
              <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-navy-500 font-bold uppercase">
                  <span>Ultimate Capacity (Pmax)</span>
                  <span className="material-symbols-outlined text-steel-500 text-base">fitness_center</span>
                </div>
                <div className="text-4xl font-heading font-black text-navy-900 tracking-tight">
                  {pmaxVal} <span className="text-lg font-normal text-navy-500">kN</span>
                </div>
                <div className="text-[11px] text-navy-500 font-mono">
                  AHEM Weighted Prediction
                </div>
              </div>

              {/* Deflection */}
              <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-navy-500 font-bold uppercase">
                  <span>Ultimate Deflection (Δult)</span>
                  <span className="material-symbols-outlined text-steel-500 text-base">square_foot</span>
                </div>
                <div className="text-4xl font-heading font-black text-navy-900 tracking-tight">
                  {deltaVal} <span className="text-lg font-normal text-navy-500">mm</span>
                </div>
                <div className="text-[11px] text-navy-500 font-mono">
                  Code Limit: L/250 ({allowableDeflection} mm)
                </div>
              </div>

              {/* Failure Mode */}
              <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-navy-500 font-bold uppercase">
                  <span>Failure Mode Classification</span>
                  <span className="material-symbols-outlined text-steel-500 text-base">psychology</span>
                </div>
                <div className="pt-1">
                  <Badge variant={getFailureBadgeVariant(failureModeStr)} size="lg">
                    {failureModeStr}
                  </Badge>
                </div>
                <div className="text-[11px] text-navy-500 font-mono">
                  CatBoost Multi-Class Model
                </div>
              </div>

            </div>

            {/* Analytical Engineering Calculations Grid */}
            <EngineeringMetricsGrid engineering={result?.engineering} />

            {/* Recommendation Panel */}
            <RecommendationCard recommendation={result?.recommendation} />

            {/* SHAP Feature Importance */}
            <ShapBarChart shapData={result?.shap} />

            {/* Expandable Ensemble Model Breakdown Table */}
            <EnsembleBreakdownTable
              pmaxBreakdown={result?.prediction?.ensemble_pmax_breakdown}
              deltaBreakdown={result?.prediction?.ensemble_deltault_breakdown}
              finalPmax={pmaxVal}
              finalDelta={deltaVal}
            />

          </div>
        )}

      </div>
    </MainLayout>
  );
}
