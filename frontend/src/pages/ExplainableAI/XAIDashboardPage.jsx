import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SHAPWaterfallChart from '../../components/charts/SHAPWaterfallChart';
import SensitivityCurveChart from '../../components/charts/SensitivityCurveChart';
import { sampleBeamCalculations } from '../../services/mockData';

export default function XAIDashboardPage() {
  const navigate = useNavigate();
  const [shapFeatures] = useState(sampleBeamCalculations.shapValues);
  const [sensitivityPoints] = useState(sampleBeamCalculations.sensitivityData.depthVariation);

  // Interactive What-If Sliders State
  const [liveLoad, setLiveLoad] = useState(45.0); // kN/m
  const [spanLength, setSpanLength] = useState(12.5); // m
  const [depth, setDepth] = useState(540); // mm

  // Real-time What-If recalculated Safety Factor
  const estimatedMu = ((1.2 * 35.0 + 1.6 * liveLoad) * Math.pow(spanLength, 2)) / 8 + (1.6 * 120.0 * spanLength) / 4;
  const estimatedMn = (345 * depth * 230 * 17.3 * 0.9) / 1e6;
  const simulatedSafetyFactor = (estimatedMn / estimatedMu).toFixed(2);

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 mb-1">
            <span className="material-symbols-outlined text-sm">visibility</span>
            EXPLAINABLE INTELLIGENCE • SHAP FEATURE ATTRIBUTION
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            Explainable AI (XAI) Inspector
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Unpack black-box structural AI recommendations through SHAP values, feature importance ranking, and parameter sensitivity curves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="description"
            onClick={() => navigate('/reports')}
          >
            Export XAI Summary
          </Button>
        </div>
      </div>

      {/* Main Grid: SHAP Waterfall & Sensitivity Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Waterfall Chart Panel */}
        <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
            <div>
              <h2 className="text-base font-heading font-bold text-navy-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600">bar_chart</span>
                SHAP Feature Impact Breakdown
              </h2>
              <p className="text-xs text-navy-500">Contribution of each design variable to Beam Safety Factor</p>
            </div>
            <Badge variant="cyan">SHAP v0.42</Badge>
          </div>

          <SHAPWaterfallChart features={shapFeatures} />

          <div className="p-3 bg-concrete-50 rounded border border-concrete-200 text-xs text-navy-700 leading-relaxed font-body">
            <strong className="font-semibold text-navy-900">Key Insight:</strong> <span className="font-mono text-steel-700">Span Length (L = 12.5m)</span> and <span className="font-mono text-steel-700">Live Load (Wl = 45 kN/m)</span> have the strongest positive contribution to bending demand, while <span className="font-mono text-cyanAccent-700">Steel Yield Strength (Fy = 50 ksi)</span> provides the primary capacity offset.
          </div>
        </div>

        {/* Sensitivity Curve Chart Panel */}
        <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
            <div>
              <h2 className="text-base font-heading font-bold text-navy-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600">show_chart</span>
                Depth vs Safety Factor & Stress Curve
              </h2>
              <p className="text-xs text-navy-500 font-mono">Beam Depth (d) variation from 450mm to 600mm</p>
            </div>
            <Badge variant="green">OPTIMAL ZONE: 530 - 550mm</Badge>
          </div>

          <SensitivityCurveChart dataPoints={sensitivityPoints} />

          <div className="p-3 bg-concrete-50 rounded border border-concrete-200 text-xs text-navy-700 leading-relaxed font-body">
            <strong className="font-semibold text-navy-900">Trade-off Analysis:</strong> Increasing depth past 540mm yields diminishing returns on safety factor while increasing structural dead weight significantly.
          </div>
        </div>
      </div>

      {/* Interactive What-If Simulator Panel */}
      <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-6">
        <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-cyanAccent-600">tune</span>
              Interactive "What-If" Parameter Simulator
            </h2>
            <p className="text-xs text-navy-500">Adjust geometry and loads to observe real-time AI safety factor shifts.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-navy-500">Simulated Safety Factor:</span>
            <span className={`text-xl font-heading font-extrabold font-mono ${
              simulatedSafetyFactor < 1.0 ? 'text-red-600' : simulatedSafetyFactor < 1.2 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {simulatedSafetyFactor}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Slider 1: Live Load */}
          <div className="p-4 bg-concrete-50 rounded border border-concrete-200 space-y-2">
            <div className="flex justify-between font-bold text-navy-800">
              <span>Distributed Live Load (Wl)</span>
              <span className="text-steel-600">{liveLoad} kN/m</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={liveLoad}
              onChange={(e) => setLiveLoad(parseFloat(e.target.value))}
              className="w-full accent-steel-500"
            />
            <div className="flex justify-between text-[10px] text-navy-400">
              <span>10 kN/m</span>
              <span>100 kN/m</span>
            </div>
          </div>

          {/* Slider 2: Span Length */}
          <div className="p-4 bg-concrete-50 rounded border border-concrete-200 space-y-2">
            <div className="flex justify-between font-bold text-navy-800">
              <span>Span Length (L)</span>
              <span className="text-steel-600">{spanLength} m</span>
            </div>
            <input
              type="range"
              min="6"
              max="20"
              step="0.5"
              value={spanLength}
              onChange={(e) => setSpanLength(parseFloat(e.target.value))}
              className="w-full accent-steel-500"
            />
            <div className="flex justify-between text-[10px] text-navy-400">
              <span>6 m</span>
              <span>20 m</span>
            </div>
          </div>

          {/* Slider 3: Beam Depth */}
          <div className="p-4 bg-concrete-50 rounded border border-concrete-200 space-y-2">
            <div className="flex justify-between font-bold text-navy-800">
              <span>Section Depth (d)</span>
              <span className="text-steel-600">{depth} mm</span>
            </div>
            <input
              type="range"
              min="300"
              max="800"
              step="10"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-steel-500"
            />
            <div className="flex justify-between text-[10px] text-navy-400">
              <span>300 mm</span>
              <span>800 mm</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
