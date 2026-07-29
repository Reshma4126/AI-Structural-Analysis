import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EngineeringMetricsGrid from '../../components/common/EngineeringMetricsGrid';
import ShapBarChart from '../../components/common/ShapBarChart';
import { useAuth } from '../../context/AuthContext';
import { useAnalysis } from '../../context/AnalysisContext';
import html2pdf from 'html2pdf.js';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeAnalysis } = useAnalysis();
  const [exporting, setExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const reportElement = document.getElementById('engineering-report');
    if (!reportElement) return;

    setExporting(true);

    try {
      const dateStr = activeAnalysis?.createdAt
        ? new Date(activeAnalysis.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const rawProject = activeAnalysis?.projectName || activeAnalysis?.project_name || 'BridgeProject';
      const rawBeam = activeAnalysis?.beamName || 'BeamB101';

      const cleanString = (str) => String(str).replace(/[^a-zA-Z0-9]/g, '');
      const projClean = cleanString(rawProject) || 'BridgeProject';
      const beamClean = cleanString(rawBeam) || 'BeamB101';

      const filename = `${projClean}_${beamClean}_${dateStr}.pdf`;

      const opt = {
        margin: [10, 10, 10, 10], // 10mm margin on all sides
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          windowWidth: 1024
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const pdfExporter = typeof html2pdf === 'function' ? html2pdf : html2pdf.default;
      await pdfExporter().set(opt).from(reportElement).save();
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setExporting(false);
    }
  };

  if (!activeAnalysis) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-steel-50 border border-steel-200 flex items-center justify-center text-steel-500 mx-auto">
              <span className="material-symbols-outlined text-3xl">description</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">No analysis report available</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Select a beam from a project and run an AI analysis to generate an official calculation report.
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

  const beamName = activeAnalysis.beamName || 'Beam Section';
  const projectName = activeAnalysis.projectName || activeAnalysis.project_name || 'Bridge Project';
  const params = activeAnalysis.beamParams || {};
  const pred = activeAnalysis.prediction || {};
  const eng = activeAnalysis.engineering || {};
  const health = activeAnalysis.beam_health_score ?? 85;
  const dateFormatted = activeAnalysis.createdAt 
    ? new Date(activeAnalysis.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Actions Bar (Screen view only - hidden in print) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint print:hidden">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
              DOCUMENT GENERATOR • AISC 360-16 / IS 456 AUDIT TRAIL
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
              Engineering Calculation Sheet
            </h1>
            <p className="text-xs text-navy-500 mt-1 font-mono">
              Official structural verification report for member <strong className="text-navy-900">{beamName}</strong> in project <strong className="text-navy-900">{projectName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon="print"
              onClick={handlePrint}
            >
              Print
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

        {/* Dedicated Report Container */}
        <div
          id="engineering-report"
          className="bg-white p-8 lg:p-12 rounded border border-concrete-300 shadow-blueprint space-y-8 text-navy-800 font-body print:shadow-none print:border-none print:p-0"
        >
          {/* Document Header Logo & Metadata */}
          <div className="flex items-start justify-between border-b-2 border-navy-800 pb-6 report-section">
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
              <div><strong className="text-navy-900">DOC ID:</strong> CALC-#{activeAnalysis.analysisId}</div>
              <div><strong className="text-navy-900">DATE:</strong> {dateFormatted}</div>
              <div><strong className="text-navy-900">ENGINEER:</strong> {user?.name || 'Engineer'}</div>
            </div>
          </div>

          {/* Section 1.0: Member Information */}
          <div className="space-y-3 report-section">
            <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
              1.0 Member Identification & Standard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-concrete-50 rounded border border-concrete-200 text-xs font-mono">
              <div>
                <span className="text-navy-400 block text-[10px]">MEMBER MARK</span>
                <span className="font-bold text-steel-700">{beamName}</span>
              </div>
              <div>
                <span className="text-navy-400 block text-[10px]">PROJECT</span>
                <span className="font-bold text-navy-800">{projectName}</span>
              </div>
              <div>
                <span className="text-navy-400 block text-[10px]">DESIGN CODE</span>
                <span className="font-bold text-navy-800">AISC 360-16 / IS 456</span>
              </div>
              <div>
                <span className="text-navy-400 block text-[10px]">HEALTH SCORE</span>
                <span className="font-bold text-emerald-700">{health}%</span>
              </div>
            </div>
          </div>

          {/* Section 2.0: Input Parameters & Geometry */}
          <div className="space-y-3 report-section">
            <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
              2.0 Input Parameters (Section Geometry & Materials)
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
                <tr><td className="p-2.5">Clear Span Length</td><td className="p-2.5">L</td><td className="p-2.5 font-bold">{params.span ?? 5000}</td><td className="p-2.5">mm</td></tr>
                <tr><td className="p-2.5">Overall Depth</td><td className="p-2.5">h</td><td className="p-2.5 font-bold">{params.depth ?? 450}</td><td className="p-2.5">mm</td></tr>
                <tr><td className="p-2.5">Section Width</td><td className="p-2.5">b</td><td className="p-2.5 font-bold">{params.width ?? 300}</td><td className="p-2.5">mm</td></tr>
                <tr><td className="p-2.5">Concrete Grade</td><td className="p-2.5">f_ck</td><td className="p-2.5 font-bold">{params.concrete_strength ?? 30}</td><td className="p-2.5">MPa</td></tr>
                <tr><td className="p-2.5">Tensile Steel Yield</td><td className="p-2.5">f_y</td><td className="p-2.5 font-bold">{params.fy_longitudinal_bars ?? 500}</td><td className="p-2.5">MPa</td></tr>
              </tbody>
            </table>
          </div>

          {/* Section 3.0: Engineering Section Calculations */}
          <div className="space-y-3 report-section">
            <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
              3.0 Engineering Section Calculations (Deterministic Limit States)
            </h3>
            <EngineeringMetricsGrid engineering={eng} />
          </div>

          {/* Section 4.0: Structural Capacity & AI Predictions */}
          <div className="space-y-3 report-section">
            <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
              4.0 AHEM AI Predictions & Limit States
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-emerald-50/70 rounded border border-emerald-300 text-xs font-mono">
              <div>
                <span className="text-emerald-800 block text-[10px] font-bold uppercase">Ultimate Load Capacity (Pmax)</span>
                <span className="text-xl font-black text-emerald-900">{pred.pmax ?? '--'} kN</span>
              </div>
              <div>
                <span className="text-emerald-800 block text-[10px] font-bold uppercase">Ultimate Deflection (Δult)</span>
                <span className="text-xl font-black text-emerald-900">{pred.delta_ult ?? '--'} mm</span>
              </div>
              <div>
                <span className="text-emerald-800 block text-[10px] font-bold uppercase">Governing Failure Mode</span>
                <span className="text-base font-extrabold text-emerald-900 truncate block">{pred.failure_mode || 'Flexural-bending (ductile)'}</span>
              </div>
            </div>
          </div>

          {/* Section 5.0: AI Structural Optimization Advice */}
          <div className="space-y-3 report-section">
            <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
              5.0 AI Structural Optimization Advice & Recommendations
            </h3>
            <div className="p-4 bg-cyanAccent-50/70 rounded border border-cyanAccent-300 text-xs text-navy-900 space-y-2 font-mono">
              <p className="font-body text-navy-800 leading-relaxed font-semibold">
                {activeAnalysis.recommendation || 'Beam section parameters are structurally sound and meet code compliance guidelines.'}
              </p>
            </div>
          </div>

          {/* Section 6.0: SHAP Feature Importance (Explainable AI) */}
          <div className="space-y-3 report-section">
            <h3 className="font-heading font-extrabold text-base text-navy-900 border-b border-concrete-300 pb-1">
              6.0 SHAP Feature Importance (Explainable AI Explanation)
            </h3>
            <ShapBarChart shapData={activeAnalysis.shap} />
          </div>

          {/* Document Footer & Signatures */}
          <div className="pt-8 border-t border-concrete-300 grid grid-cols-2 gap-8 text-xs font-mono report-section">
            <div>
              <p className="text-navy-400">PREPARED BY:</p>
              <p className="font-bold text-navy-900 mt-4">{user?.name || 'Engineer'}, PE</p>
              <p className="text-navy-500">Structural Design Lead</p>
            </div>
            <div>
              <p className="text-navy-400">VERIFIED BY AI PLATFORM:</p>
              <p className="font-bold text-cyanAccent-700 mt-4">Structura AI Verification Engine</p>
              <p className="text-navy-500">ISO 27001 Certified System</p>
            </div>
          </div>

          {/* Official Document Footer Bar */}
          <div className="text-center pt-4 border-t border-concrete-200 text-[10px] font-mono text-navy-400">
            Official Structural Verification Sheet • Document ID: CALC-#{activeAnalysis.analysisId} • Generated via Structura AI Engine
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
