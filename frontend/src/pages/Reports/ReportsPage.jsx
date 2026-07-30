import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useAnalysis } from '../../context/AnalysisContext';
import html2pdf from 'html2pdf.js';
import StructWiseLogo from '../../components/common/StructWiseLogo';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeAnalysis } = useAnalysis();
  const [exporting, setExporting] = useState(false);

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    const el = document.getElementById('engineering-report');
    if (!el) return;
    setExporting(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      const beam = String(activeAnalysis?.beamName || 'Beam').replace(/[^a-zA-Z0-9]/g, '');
      await (typeof html2pdf === 'function' ? html2pdf : html2pdf.default)()
        .set({
          margin: [12, 12, 12, 12],
          filename: `${beam}_Report_${date}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 900 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save();
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  // Data
  const d = activeAnalysis || {
    beamName: 'Beam B-101',
    projectName: 'Bridge Project',
    beamParams: { width: 300, depth: 450, span: 5000, concrete_strength: 30,
                  num_tensile_bars: 4, diameter_tensile_bars: 20, fy_longitudinal_bars: 500,
                  num_stirrup_legs: 2, stirrup_spacing: 150, stirrup_diameter: 8 },
    prediction: { pmax: 249.6, delta_ult: 48.2, failure_mode: 'Flexural-bending (ductile)' },
    beam_health_score: 80.6,
    recommendation: { summary: 'Beam section parameters are structurally sound.' },
    createdAt: new Date().toISOString(),
  };

  const p   = d.beamParams || {};
  const res = d.prediction || {};
  const hs  = d.beam_health_score ?? '--';
  const dateStr = d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const allowable = p.span ? (p.span / 250).toFixed(1) : '--';
  const recSummary = typeof d.recommendation === 'string'
    ? d.recommendation
    : d.recommendation?.summary || '—';

  const hsColor = parseFloat(hs) >= 85 ? '#10B981' : parseFloat(hs) >= 70 ? '#F59E0B' : '#EF4444';
  const hsLabel = parseFloat(hs) >= 85 ? 'PASS' : parseFloat(hs) >= 70 ? 'REVIEW' : 'FAIL';

  return (
    <MainLayout>
      <div className="space-y-4 max-w-3xl mx-auto">

        {/* ── Action Bar (hidden in print) ── */}
        <div className="sw-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
              AISC 360-16 / IS 456 Structural Report
            </p>
            <h1 className="text-lg font-heading font-extrabold text-[#0F172A] mt-0.5">
              Engineering Calculation Sheet
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" icon="print" size="sm" onClick={handlePrint}>Print</Button>
            <Button variant="primary" icon="picture_as_pdf" size="sm" disabled={exporting} onClick={handleExportPDF}>
              {exporting ? 'Preparing...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* ── Report Document ── */}
        <div
          id="engineering-report"
          className="bg-white rounded-xl border border-[#E2E8F0] p-8 space-y-6 text-[#0F172A] print:shadow-none print:border-none print:p-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >

          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#0F172A] pb-4">
            <div>
              <StructWiseLogo className="h-10 w-auto mb-1" />
              <p className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest mt-1">
                AI-Powered Structural Intelligence
              </p>
            </div>
            <div className="text-right text-[10px] font-mono text-[#334155] space-y-0.5">
              <p><span className="text-[#94A3B8]">BEAM:</span> <strong>{d.beamName}</strong></p>
              <p><span className="text-[#94A3B8]">PROJECT:</span> <strong>{d.projectName || 'Bridge Project'}</strong></p>
              <p><span className="text-[#94A3B8]">DATE:</span> {dateStr}</p>
              <p><span className="text-[#94A3B8]">ENGINEER:</span> {user?.name || 'Engineer'}</p>
            </div>
          </div>

          {/* Section 1: Input Parameters */}
          <div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-2 border-b border-[#E2E8F0] pb-1">
              1. Input Parameters
            </h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left p-2 font-mono font-bold text-[#334155] border border-[#E2E8F0] uppercase text-[10px]">Parameter</th>
                  <th className="text-left p-2 font-mono font-bold text-[#334155] border border-[#E2E8F0] uppercase text-[10px]">Symbol</th>
                  <th className="text-left p-2 font-mono font-bold text-[#334155] border border-[#E2E8F0] uppercase text-[10px]">Value</th>
                  <th className="text-left p-2 font-mono font-bold text-[#334155] border border-[#E2E8F0] uppercase text-[10px]">Unit</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[11px] text-[#0F172A]">
                {[
                  ['Span Length',          'L',       p.span ?? 5000,                    'mm'],
                  ['Section Width',        'b',       p.width ?? 300,                    'mm'],
                  ['Overall Depth',        'h',       p.depth ?? 450,                    'mm'],
                  ['Concrete Grade',       'f\'ck',   `M${p.concrete_strength ?? 30}`,   'MPa'],
                  ['Steel Yield (Long.)',  'f_y',     p.fy_longitudinal_bars ?? 500,     'MPa'],
                  ['Tensile Bars',         'Ast',     `${p.num_tensile_bars ?? 4}T${p.diameter_tensile_bars ?? 20}`, '—'],
                  ['Stirrups',             's',       `${p.num_stirrup_legs ?? 2}L-T${p.stirrup_diameter ?? 8} @ ${p.stirrup_spacing ?? 150}mm`, '—'],
                ].map(([name, sym, val, unit], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                    <td className="p-2 border border-[#E2E8F0]">{name}</td>
                    <td className="p-2 border border-[#E2E8F0] italic">{sym}</td>
                    <td className="p-2 border border-[#E2E8F0] font-bold">{val}</td>
                    <td className="p-2 border border-[#E2E8F0] text-[#64748B]">{unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: AI Prediction Results */}
          <div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-2 border-b border-[#E2E8F0] pb-1">
              2. AI Prediction Results (AHEM Ensemble)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Pmax (Ultimate Load)',    value: `${res.pmax ?? '--'} kN`,  bg: '#F0FDF4', border: '#86EFAC', text: '#166534' },
                { label: 'Δult (Ultimate Deflection)', value: `${res.delta_ult ?? '--'} mm`, bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF' },
                { label: 'Allowable Deflection',   value: `L/250 = ${allowable} mm`, bg: '#FEFCE8', border: '#FDE047', text: '#713F12' },
                { label: 'Governing Failure Mode', value: res.failure_mode || '—', bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412' },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3 border" style={{ background: item.bg, borderColor: item.border }}>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-wider mb-1" style={{ color: item.text }}>{item.label}</p>
                  <p className="text-sm font-black font-mono leading-tight" style={{ color: item.text }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Health Score */}
          <div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-2 border-b border-[#E2E8F0] pb-1">
              3. Beam Health Score
            </h2>
            <div className="flex items-center gap-4 p-4 rounded-lg border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
              {/* Score circle */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-4" style={{ borderColor: hsColor }}>
                <span className="font-black text-base font-mono" style={{ color: hsColor }}>{hs}%</span>
              </div>
              <div>
                <p className="font-heading font-extrabold text-base" style={{ color: hsColor }}>{hsLabel}</p>
                <p className="text-[11px] font-mono text-[#64748B] mt-0.5">
                  IS 456 Serviceability Limit State — Allowable deflection: L/250 = {allowable} mm
                </p>
              </div>
              <div className="ml-auto text-right text-[10px] font-mono text-[#94A3B8]">
                <p>AISC 360-16 / IS 456</p>
                <p>ML Accuracy: 95.63%</p>
              </div>
            </div>
          </div>

          {/* Section 4: Recommendations */}
          <div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-2 border-b border-[#E2E8F0] pb-1">
              4. AI Recommendations
            </h2>
            <div className="p-3 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] text-[11px] font-mono text-[#92400E] leading-relaxed">
              {recSummary}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>StructWise AI • AI-Powered Structural Intelligence</span>
            <span>Generated: {dateStr} • Engineer: {user?.name || '—'}</span>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
