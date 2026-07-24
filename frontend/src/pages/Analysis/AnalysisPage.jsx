import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MetricCard from '../../components/common/MetricCard';
import MomentDiagramChart from '../../components/charts/MomentDiagramChart';
import { sampleBeamCalculations } from '../../services/mockData';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [selectedIteration, setSelectedIteration] = useState('iter-2');

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            MODULE 4 • AI ANALYSIS & EXPLAINABILITY RESULTS
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
            Prediction, Health Score & Structural Performance
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Analysis results generated from validated beam geometry, material, and ultimate limit state loads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="download"
            onClick={() => navigate('/reports')}
          >
            Export Analysis PDF
          </Button>
          <Button
            variant="accent"
            icon="tips_and_updates"
            onClick={() => navigate('/recommendations')}
          >
            AI Recommendations
          </Button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Structural Health Score"
          value="94"
          unit="/100"
          subtitle="Structural integrity check passed"
          icon="verified_user"
          statusColor="green"
        />
        <MetricCard
          title="Bending Utilization"
          value="82.5%"
          unit="Mu / φMn"
          subtitle="Limit state: 0.825 < 1.0"
          icon="trending_up"
          statusColor="steel"
        />
        <MetricCard
          title="Shear Utilization"
          value="79.2%"
          unit="Vu / φVn"
          subtitle="Limit state: 0.792 < 1.0"
          icon="show_chart"
          statusColor="steel"
        />
        <MetricCard
          title="Deflection L/δ"
          value="24.2"
          unit="mm (L/516)"
          subtitle="Strict L/360 limit: 34.7mm"
          icon="straighten"
          statusColor="green"
        />
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stress & Bending Diagram */}
        <div className="lg:col-span-2 space-y-6">
          {/* Internal Force Diagrams */}
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
              <h2 className="text-base font-heading font-bold text-navy-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600">query_stats</span>
                Bending Moment & Shear Envelope (1.2D + 1.6L)
              </h2>
              <Badge variant="green" icon="check">AISC Compliant</Badge>
            </div>
            <MomentDiagramChart
              spanLength={sampleBeamCalculations.spanLength}
              maxMoment={sampleBeamCalculations.structuralResults.maxBendingMoment}
              maxShear={sampleBeamCalculations.structuralResults.maxShearForce}
            />
          </div>

          {/* Iteration Comparison Table */}
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
              <h2 className="text-base font-heading font-bold text-navy-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600">compare_arrows</span>
                Design Iteration Comparison
              </h2>
              <span className="text-xs font-mono text-navy-400">3 Candidates Evaluated</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-navy-50 font-heading font-bold text-navy-700 uppercase">
                  <tr>
                    <th className="p-3">Iteration</th>
                    <th className="p-3">Section Profile</th>
                    <th className="p-3">Weight (kg/m)</th>
                    <th className="p-3">Moment Ratio</th>
                    <th className="p-3">Safety Factor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-concrete-200 font-mono">
                  <tr className="bg-steel-50/60 font-semibold">
                    <td className="p-3 text-steel-700">Iter #1 (Current)</td>
                    <td className="p-3 text-navy-900">W24x76</td>
                    <td className="p-3">113.1</td>
                    <td className="p-3">0.825</td>
                    <td className="p-3 text-emerald-600">1.48</td>
                    <td className="p-3"><Badge variant="steel">BASELINE</Badge></td>
                  </tr>
                  <tr className="bg-cyanAccent-50/60 font-semibold border-l-4 border-cyanAccent-500">
                    <td className="p-3 text-cyanAccent-800">Iter #2 (AI Best)</td>
                    <td className="p-3 text-navy-900">W21x62</td>
                    <td className="p-3 text-cyanAccent-700">92.3 (-18.4%)</td>
                    <td className="p-3">0.890</td>
                    <td className="p-3 text-emerald-600">1.41</td>
                    <td className="p-3"><Badge variant="cyan">AI RECOMMENDED</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-3 text-navy-600">Iter #3 (Heavy Depth)</td>
                    <td className="p-3 text-navy-900">W24x68</td>
                    <td className="p-3">101.2 (-10.5%)</td>
                    <td className="p-3">0.760</td>
                    <td className="p-3 text-emerald-600">1.56</td>
                    <td className="p-3"><Badge variant="navy">CONSERVATIVE</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Remarks & Next Steps */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-4">
            <h3 className="font-heading font-bold text-sm text-navy-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-steel-600">description</span>
              Engineering Lead Remarks
            </h3>
            <div className="p-3 bg-concrete-50 rounded border border-concrete-200 text-xs text-navy-700 leading-relaxed font-body">
              "Bending moment capacity is well within AISC LRFD allowable limits. Web shear stress ratio is 0.792, requiring no transverse stiffeners. Deflection limits under full live load remain compliant."
            </div>
            <div className="text-[11px] font-mono text-navy-400">
              Approved by: Eleanor Vance, PE #884920-CA
            </div>
          </div>

          {/* AI Explainability Trigger */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 text-white p-5 rounded border border-navy-700 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-cyanAccent-400 font-mono text-xs font-bold uppercase">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Explainable AI (SHAP)
            </div>
            <h4 className="font-heading font-bold text-base">
              Why did AI select section W21x62?
            </h4>
            <p className="text-xs text-navy-200 leading-relaxed">
              Explore feature importance scores, SHAP waterfall impact values, and interactive parameter sensitivity plots.
            </p>
            <Button
              variant="accent"
              size="sm"
              className="w-full justify-center"
              icon="arrow_forward"
              iconPosition="right"
              onClick={() => navigate('/xai')}
            >
              Open XAI Inspector
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
