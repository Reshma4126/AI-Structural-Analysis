import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { sampleBeamCalculations, currentUser } from '../../services/mockData';

export default function ReportsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      window.print();
    }, 600);
  };

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
            DOCUMENT GENERATOR • AISC 360-16 AUDIT TRAIL
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            Engineering Calculation Sheet
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Official structural verification report for member Beam B-104 (Transfer Girder).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="print"
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outline"
            icon="table_chart"
            onClick={() => alert('Exporting raw calculation parameters to Excel (.xlsx)...')}
          >
            Excel
          </Button>
          <Button
            variant="primary"
            icon="picture_as_pdf"
            disabled={exporting}
            onClick={handleExportPDF}
          >
            {exporting ? 'Preparing PDF...' : 'Download PDF Report'}
          </Button>
        </div>
      </div>

      {/* Official Calculation Sheet Document Container */}
      <div className="bg-white p-8 lg:p-12 rounded border border-concrete-300 shadow-blueprint space-y-8 max-w-4xl mx-auto text-navy-800 font-body print:shadow-none print:border-none print:p-0">
        {/* Document Header Logo & Meta */}
        <div className="flex items-start justify-between border-b-2 border-navy-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-steel-500 flex items-center justify-center text-white font-bold shadow-md">
              <span className="material-symbols-outlined text-3xl">domain</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-navy-900 tracking-tight">
                STRUCTURA <span className="text-steel-600">AI</span>
              </h2>
              <p className="text-xs font-mono text-navy-500 uppercase">
                Precision Structural Decision Support Platform
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-navy-600 space-y-1">
            <div><strong className="text-navy-900">DOC ID:</strong> CALC-2026-B104</div>
            <div><strong className="text-navy-900">DATE:</strong> July 21, 2026</div>
            <div><strong className="text-navy-900">ENGINEER:</strong> {currentUser.name}</div>
          </div>
        </div>

        {/* Section 1.0: Project Information */}
        <div className="space-y-3">
          <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
            1.0 Project Information
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-concrete-50 rounded border border-concrete-200 text-xs font-mono">
            <div>
              <span className="text-navy-400 block text-[10px]">PROJECT TITLE</span>
              <span className="font-bold text-navy-800">Hudson Yards Tower A</span>
            </div>
            <div>
              <span className="text-navy-400 block text-[10px]">MEMBER MARK</span>
              <span className="font-bold text-steel-700">Beam B-104</span>
            </div>
            <div>
              <span className="text-navy-400 block text-[10px]">DESIGN CODE</span>
              <span className="font-bold text-navy-800">AISC 360-16 LRFD</span>
            </div>
            <div>
              <span className="text-navy-400 block text-[10px]">STEEL GRADE</span>
              <span className="font-bold text-navy-800">ASTM A992 (50 ksi)</span>
            </div>
          </div>
        </div>

        {/* Section 2.0: Input Parameters & Geometry */}
        <div className="space-y-3">
          <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
            2.0 Input Parameters (Beam Geometry & Load Cases)
          </h3>
          <table className="w-full text-left text-xs font-mono border border-concrete-200">
            <thead className="bg-navy-50 font-heading font-bold text-navy-700 uppercase">
              <tr>
                <th className="p-2.5 border-b border-concrete-200">Parameter</th>
                <th className="p-2.5 border-b border-concrete-200">Symbol</th>
                <th className="p-2.5 border-b border-concrete-200">Value</th>
                <th className="p-2.5 border-b border-concrete-200">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              <tr><td className="p-2.5">Span Length</td><td className="p-2.5">L</td><td className="p-2.5 font-bold">12.50</td><td className="p-2.5">m</td></tr>
              <tr><td className="p-2.5">Beam Depth</td><td className="p-2.5">d</td><td className="p-2.5 font-bold">540.0</td><td className="p-2.5">mm</td></tr>
              <tr><td className="p-2.5">Flange Width</td><td className="p-2.5">b_f</td><td className="p-2.5 font-bold">230.0</td><td className="p-2.5">mm</td></tr>
              <tr><td className="p-2.5">Flange Thickness</td><td className="p-2.5">t_f</td><td className="p-2.5 font-bold">17.30</td><td className="p-2.5">mm</td></tr>
              <tr><td className="p-2.5">Web Thickness</td><td className="p-2.5">t_w</td><td className="p-2.5 font-bold">11.20</td><td className="p-2.5">mm</td></tr>
              <tr><td className="p-2.5">Distributed Dead Load</td><td className="p-2.5">W_d</td><td className="p-2.5 font-bold">35.00</td><td className="p-2.5">kN/m</td></tr>
              <tr><td className="p-2.5">Distributed Live Load</td><td className="p-2.5">W_l</td><td className="p-2.5 font-bold">45.00</td><td className="p-2.5">kN/m</td></tr>
              <tr><td className="p-2.5">Mid-span Point Load</td><td className="p-2.5">P_mid</td><td className="p-2.5 font-bold">120.00</td><td className="p-2.5">kN</td></tr>
            </tbody>
          </table>
        </div>

        {/* Section 3.0: Structural Capacity Check */}
        <div className="space-y-3">
          <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
            3.0 Structural Evaluation Results
          </h3>
          <div className="p-4 bg-emerald-50 rounded border border-emerald-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-emerald-900">
                OVERALL CODE STATUS: PASSED
              </span>
              <Badge variant="green">SAFETY FACTOR: 1.48</Badge>
            </div>
            <p className="text-xs text-emerald-900 font-body leading-relaxed">
              Factored Bending Moment M_u = 612.4 kN·m vs Nominal Resistance φM_n = 742.0 kN·m (Utilization: 82.5%). Shear force V_u = 245.8 kN vs Capacity φV_n = 310.5 kN (Utilization: 79.2%). Deflection δ_max = 24.2 mm &lt; L/360 limit (34.7 mm).
            </p>
          </div>
        </div>

        {/* Section 4.0: AI Recommendation Summary */}
        <div className="space-y-3">
          <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
            4.0 AI Optimization Recommendation
          </h3>
          <div className="p-4 bg-cyanAccent-50/70 rounded border border-cyanAccent-300 text-xs text-navy-900 space-y-2 font-mono">
            <div className="font-bold text-cyanAccent-800">
              RECOMMENDED SECTION: W21x62 (Weight Saving: 18.4%)
            </div>
            <p className="font-body text-navy-700">
              The AI Decision Engine identifies W21x62 as the optimal cross-section, reducing structural steel tonnage by 2.45 Tons for member Beam B-104 while maintaining an AISC safety factor of 1.41.
            </p>
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="pt-8 border-t border-concrete-300 grid grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <p className="text-navy-400">PREPARED BY:</p>
            <p className="font-bold text-navy-900 mt-4">{currentUser.name}, PE</p>
            <p className="text-navy-500">Principal Structural Engineer</p>
          </div>
          <div>
            <p className="text-navy-400">CHECKED BY AI ENGINE:</p>
            <p className="font-bold text-cyanAccent-700 mt-4">Structura AI v4.2 Verification</p>
            <p className="text-navy-500">ISO 27001 Certified System</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
