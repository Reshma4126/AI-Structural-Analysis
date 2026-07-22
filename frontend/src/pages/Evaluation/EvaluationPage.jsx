import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MetricCard from '../../components/common/MetricCard';

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [selectedStandard, setSelectedStandard] = useState('AISC 360-16 LRFD');

  const complianceChecks = [
    { code: 'AISC 360-16 Ch. F2', check: 'Flexural Yielding & LTB (Major Axis)', ratio: '0.825', limit: '1.00', status: 'PASSED' },
    { code: 'AISC 360-16 Ch. G2', check: 'Web Shear Buckling & Yielding', ratio: '0.792', limit: '1.00', status: 'PASSED' },
    { code: 'AISC 360-16 Ch. L3', check: 'Serviceability Live Load Deflection', ratio: '0.697', limit: '1.00 (L/360)', status: 'PASSED' },
    { code: 'AISC 360-16 Ch. B4', check: 'Local Buckling - Flange Compactness', ratio: '0.512', limit: 'λp = 9.15', status: 'COMPACT' },
    { code: 'AISC 360-16 Ch. B4', check: 'Local Buckling - Web Compactness', ratio: '0.440', limit: 'λp = 90.5', status: 'COMPACT' },
    { code: 'AISC 360-16 Ch. H1', check: 'Combined Axial & Flexural Interaction', ratio: '0.842', limit: '1.00', status: 'PASSED' },
  ];

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
            COMPLIANCE EVALUATOR • MULTI-STANDARD
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            Structural Safety & Code Evaluation
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Verification of ultimate limit states (ULS) and serviceability limit states (SLS) against international codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="px-3 py-2 bg-concrete-100 border border-concrete-300 rounded text-xs font-mono font-bold text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
          >
            <option value="AISC 360-16 LRFD">AISC 360-16 LRFD (USA)</option>
            <option value="Eurocode 3 (EN 1993)">Eurocode 3 EN 1993 (EU)</option>
            <option value="CSA S16-19">CSA S16-19 (Canada)</option>
            <option value="BS 5950">BS 5950 (UK)</option>
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
          title="Overall Compliance"
          value="100%"
          subtitle="6 of 6 checks passed"
          icon="verified"
          statusColor="green"
          badgeText="ZERO VIOLATIONS"
        />
        <MetricCard
          title="Governing Check"
          value="0.842"
          unit="Ratio"
          subtitle="Combined Flexure & Axial"
          icon="balance"
          statusColor="steel"
        />
        <MetricCard
          title="Minimum Reserve"
          value="15.8%"
          subtitle="Capacity headroom remaining"
          icon="shield_lock"
          statusColor="cyan"
        />
        <MetricCard
          title="Deflection Limit"
          value="L/516"
          unit="vs L/360 limit"
          subtitle="24.2mm actual vs 34.7mm max"
          icon="straighten"
          statusColor="green"
        />
      </div>

      {/* Code Compliance Matrix Table */}
      <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
        <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
          <h2 className="text-base font-heading font-bold text-navy-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-steel-600">checklist</span>
            {selectedStandard} Code Check Matrix
          </h2>
          <span className="text-xs font-mono text-navy-400">Target Member: Beam B-104</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-navy-50 font-heading font-bold text-navy-700 uppercase">
              <tr>
                <th className="p-3">Clause Reference</th>
                <th className="p-3">Structural Evaluation Requirement</th>
                <th className="p-3">Demand / Capacity Ratio</th>
                <th className="p-3">Allowable Code Threshold</th>
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
                    <Badge variant={item.status === 'PASSED' ? 'green' : 'cyan'}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-concrete-200 flex items-center justify-between text-xs">
          <span className="text-navy-500">Evaluated on AISC 360-16 Specification Chapter B through L.</span>
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
    </MainLayout>
  );
}
