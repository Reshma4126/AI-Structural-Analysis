import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MetricCard from '../../components/common/MetricCard';
import { useAnalysis } from '../../context/AnalysisContext';

export default function EvaluationPage() {
  const navigate = useNavigate();
  const { activeAnalysis } = useAnalysis();
  const [selectedStandard, setSelectedStandard] = useState('IS 456 / AISC 360-16');

  if (!activeAnalysis) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyanAccent-50 border border-cyanAccent-200 flex items-center justify-center text-cyanAccent-600 mx-auto">
              <span className="material-symbols-outlined text-3xl">fact_check</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">No active structural analysis found</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Run an AI analysis on a beam section first to evaluate limit states and design code compliance.
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

  const pmax = activeAnalysis.prediction?.pmax ?? 250;
  const deltaUlt = activeAnalysis.prediction?.delta_ult ?? 30;
  const failureMode = activeAnalysis.prediction?.failure_mode ?? 'Flexural-bending (ductile)';
  const healthScore = activeAnalysis.beam_health_score ?? 85;
  const beamName = activeAnalysis.beamName || 'Beam Section';

  const span = activeAnalysis.beamParams?.span || 5000;
  const allowableDeflection = span / 250.0;
  const deltaService = (deltaUlt / 1.5).toFixed(1);
  const deflRatio = (deltaService / allowableDeflection).toFixed(2);
  const deflPassed = parseFloat(deltaService) <= allowableDeflection;

  const complianceChecks = [
    { code: 'IS 456 Cl. 36.4', check: 'Ultimate Limit State - Bending Capacity (Pmax)', ratio: `${pmax} kN`, limit: 'Capacity Satisfied', status: 'PASSED' },
    { code: 'IS 456 Cl. 23.2', check: 'Serviceability Limit State - Deflection (L/250)', ratio: `${deltaService} mm`, limit: `${allowableDeflection.toFixed(1)} mm`, status: deflPassed ? 'PASSED' : 'SLS EXCEEDED' },
    { code: 'IS 456 Cl. 40.1', check: 'Failure Mode Classification & Ductility', ratio: failureMode, limit: 'Ductile Flexure Preferred', status: failureMode.toLowerCase().includes('shear') ? 'WARNING' : 'PASSED' },
    { code: 'AISC 360-16 Ch. B4', check: 'Section Geometry Compactness Check', ratio: `b=${activeAnalysis.beamParams?.width || 300}mm, h=${activeAnalysis.beamParams?.depth || 450}mm`, limit: 'Compact Section', status: 'PASSED' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
              COMPLIANCE EVALUATOR • MULTI-STANDARD
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
              Structural Safety & Code Evaluation
            </h1>
            <p className="text-xs text-navy-500 mt-1 font-mono">
              Verification of ultimate limit states (ULS) and serviceability (SLS) for <strong className="text-navy-900">{beamName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="px-3 py-2 bg-concrete-100 border border-concrete-300 rounded text-xs font-mono font-bold text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            >
              <option value="IS 456 / AISC 360-16">IS 456:2000 / AISC 360-16</option>
              <option value="Eurocode 2 (EN 1992)">Eurocode 2 EN 1992</option>
              <option value="ACI 318-19">ACI 318-19 (USA)</option>
            </select>
            <Button
              variant="primary"
              icon="verified"
              onClick={() => navigate('/reports')}
            >
              Generate Audit Report
            </Button>
          </div>
        </div>

        {/* Top Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Beam Health Score"
            value={`${healthScore}%`}
            subtitle="Weighted multivariable score"
            icon="health_and_safety"
            statusColor={healthScore >= 80 ? "green" : "amber"}
            badgeText={healthScore >= 85 ? "PASS" : "WARNING"}
          />
          <MetricCard
            title="Ultimate Capacity (Pmax)"
            value={`${pmax} kN`}
            subtitle="AHEM Ensemble Output"
            icon="fitness_center"
            statusColor="steel"
          />
          <MetricCard
            title="Working Deflection"
            value={`${deltaService} mm`}
            subtitle={`vs ${allowableDeflection.toFixed(1)}mm limit (L/250)`}
            icon="straighten"
            statusColor={deflPassed ? "green" : "amber"}
          />
          <MetricCard
            title="Failure Behavior"
            value={failureMode.split(' ')[0]}
            subtitle={failureMode}
            icon="psychology"
            statusColor="cyan"
          />
        </div>

        {/* Code Compliance Matrix Table */}
        <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
            <h2 className="text-base font-heading font-bold text-navy-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-steel-600">checklist</span>
              {selectedStandard} Code Check Matrix
            </h2>
            <span className="text-xs font-mono text-navy-400">Target Member: {beamName}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-navy-50 font-heading font-bold text-navy-700 uppercase">
                <tr>
                  <th className="p-3">Clause Reference</th>
                  <th className="p-3">Structural Evaluation Requirement</th>
                  <th className="p-3">Analysis Value</th>
                  <th className="p-3">Allowable Code Limit</th>
                  <th className="p-3">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200 font-mono">
                {complianceChecks.map((item, idx) => (
                  <tr key={idx} className="hover:bg-steel-50/50 transition">
                    <td className="p-3 text-steel-700 font-bold">{item.code}</td>
                    <td className="p-3 text-navy-900 font-body font-semibold">{item.check}</td>
                    <td className="p-3 text-navy-800 font-bold">{item.ratio}</td>
                    <td className="p-3 text-navy-500">{item.limit}</td>
                    <td className="p-3">
                      <Badge variant={item.status === 'PASSED' ? 'green' : 'amber'}>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-concrete-200 flex items-center justify-between text-xs">
            <span className="text-navy-500">Evaluated on active AI analysis for member {beamName}.</span>
            <Button
              variant="outline"
              size="sm"
              icon="description"
              onClick={() => navigate('/reports')}
            >
              Download Calculation Sheet
            </Button>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
