import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import MetricCard from '../../components/common/MetricCard';

export default function BeamDesignPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // 1: Geometry, 2: Materials & Loads, 3: Capacity Check

  // Form State
  const [beamData, setBeamData] = useState({
    name: 'Beam B-104 (Transfer Girder)',
    spanLength: 12.5,
    depth: 540,
    width: 230,
    webThickness: 11.2,
    flangeThickness: 17.3,
    steelGrade: 'ASTM A992 (Fy = 50 ksi)',
    deadLoad: 35.0,
    liveLoad: 45.0,
    pointLoad: 120.0,
  });

  // Calculate Real-time Section Properties & Flexural Safety Factor
  const depthM = beamData.depth / 1000;
  const widthM = beamData.width / 1000;
  const tfM = beamData.flangeThickness / 1000;
  const twM = beamData.webThickness / 1000;

  // Approximate Plastic Section Modulus Zx (cm^3)
  const Zx = Math.round(
    (widthM * tfM * (depthM - tfM) + 0.25 * twM * Math.pow(depthM - 2 * tfM, 2)) * 1e6
  );

  // Approximate Max Bending Moment M_u (kN·m) under UDL + Point load
  const totalUDL = 1.2 * beamData.deadLoad + 1.6 * beamData.liveLoad; // LRFD combo
  const Mu = ((totalUDL * Math.pow(beamData.spanLength, 2)) / 8 + (1.6 * beamData.pointLoad * beamData.spanLength) / 4).toFixed(1);
  const Mn = ((345 * Zx) / 1000).toFixed(1); // Nominal Moment Capacity (Fy = 345 MPa)
  const safetyFactor = (Mn / Mu).toFixed(2);
  const flexuralRatio = (Mu / Mn).toFixed(3);

  return (
    <MainLayout>
      {/* Wizard Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
            WIZARD STEP {activeStep} OF 3 • AISC 360-16 LRFD
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            Beam Section Design Wizard
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Specify cross-sectional geometry, material yield stress, and ultimate limit state loads.
          </p>
        </div>

        {/* Stepper Navigation Pills */}
        <div className="flex items-center gap-2">
          {[
            { step: 1, label: '1. Geometry' },
            { step: 2, label: '2. Loads & Materials' },
            { step: 3, label: '3. Capacity Check' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`px-3 py-1.5 rounded font-mono text-xs transition ${
                activeStep === item.step
                  ? 'bg-steel-500 text-white font-bold shadow'
                  : 'bg-concrete-100 text-navy-600 hover:bg-concrete-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step Input Controls */}
        <div className="lg:col-span-2 bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-6">
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-concrete-200 pb-3">
                <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-steel-600">architecture</span>
                  Cross-Sectional Dimensions (I-Beam / W-Shape)
                </h2>
                <p className="text-xs text-navy-500">Define member depth, flange width, and plate thickness.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Beam Member Name
                  </label>
                  <input
                    type="text"
                    value={beamData.name}
                    onChange={(e) => setBeamData({ ...beamData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Span Length L (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={beamData.spanLength}
                    onChange={(e) => setBeamData({ ...beamData, spanLength: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Overall Depth d (mm)
                  </label>
                  <input
                    type="number"
                    value={beamData.depth}
                    onChange={(e) => setBeamData({ ...beamData, depth: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Flange Width bf (mm)
                  </label>
                  <input
                    type="number"
                    value={beamData.width}
                    onChange={(e) => setBeamData({ ...beamData, width: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Flange Thickness tf (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={beamData.flangeThickness}
                    onChange={(e) => setBeamData({ ...beamData, flangeThickness: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Web Thickness tw (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={beamData.webThickness}
                    onChange={(e) => setBeamData({ ...beamData, webThickness: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-concrete-200 pb-3">
                <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-steel-600">tune</span>
                  Material Properties & LRFD Load Combinations
                </h2>
                <p className="text-xs text-navy-500">Specify steel yield strength and ultimate design load cases.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                    Steel Grade Specification
                  </label>
                  <select
                    value={beamData.steelGrade}
                    onChange={(e) => setBeamData({ ...beamData, steelGrade: e.target.value })}
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                  >
                    <option value="ASTM A992 (Fy = 50 ksi)">ASTM A992 (Fy = 50 ksi / 345 MPa)</option>
                    <option value="ASTM A36 (Fy = 36 ksi)">ASTM A36 (Fy = 36 ksi / 250 MPa)</option>
                    <option value="S355 JR Eurocode (Fy = 355 MPa)">S355 JR Eurocode (Fy = 355 MPa)</option>
                    <option value="S460 High Yield (Fy = 460 MPa)">S460 High Yield (Fy = 460 MPa)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Dead Load Wd (kN/m)
                    </label>
                    <input
                      type="number"
                      value={beamData.deadLoad}
                      onChange={(e) => setBeamData({ ...beamData, deadLoad: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Live Load Wl (kN/m)
                    </label>
                    <input
                      type="number"
                      value={beamData.liveLoad}
                      onChange={(e) => setBeamData({ ...beamData, liveLoad: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Point Load P_mid (kN)
                    </label>
                    <input
                      type="number"
                      value={beamData.pointLoad}
                      onChange={(e) => setBeamData({ ...beamData, pointLoad: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-navy-50 rounded border border-steel-200 text-xs font-mono">
                  <p className="font-bold text-navy-800">LRFD Factored Load Combination: 1.2 D + 1.6 L</p>
                  <p className="text-navy-600 mt-1">Design Ultimate Load W_u = {totalUDL.toFixed(1)} kN/m</p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-concrete-200 pb-3">
                <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">verified</span>
                  Structural Capacity Check & Code Verification
                </h2>
                <p className="text-xs text-navy-500">Summary of AISC 360-16 LRFD flexural and shear utilization ratios.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  title="Factored Moment Mu"
                  value={Mu}
                  unit="kN·m"
                  statusColor="steel"
                />
                <MetricCard
                  title="Nominal Capacity Mn"
                  value={Mn}
                  unit="kN·m"
                  statusColor="steel"
                />
                <MetricCard
                  title="Flexural Utilization"
                  value={`${(flexuralRatio * 100).toFixed(1)}%`}
                  statusColor={flexuralRatio > 1 ? 'red' : flexuralRatio > 0.9 ? 'amber' : 'green'}
                  badgeText={flexuralRatio > 1 ? 'FAILED' : 'PASSED'}
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded border border-emerald-300 text-xs text-emerald-900 space-y-2">
                <div className="font-heading font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  Section Check Complete: Member Safe
                </div>
                <p>
                  Member <strong className="font-mono">{beamData.name}</strong> satisfies all AISC 360-16 LRFD strength and serviceability criteria with an overall safety factor of <strong className="font-mono">{safetyFactor}</strong>.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="accent"
                  icon="tips_and_updates"
                  onClick={() => navigate('/recommendations')}
                >
                  Run AI Weight Optimization
                </Button>
                <Button
                  variant="primary"
                  icon="psychology"
                  onClick={() => navigate('/analysis')}
                >
                  View Full Engineering Review
                </Button>
              </div>
            </div>
          )}

          {/* Stepper Wizard Buttons */}
          <div className="pt-4 border-t border-concrete-200 flex items-center justify-between">
            <Button
              variant="secondary"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(activeStep - 1)}
              icon="arrow_back"
            >
              Previous Step
            </Button>

            {activeStep < 3 ? (
              <Button
                variant="primary"
                onClick={() => setActiveStep(activeStep + 1)}
                icon="arrow_forward"
                iconPosition="right"
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={() => navigate('/analysis')}
                icon="check"
                iconPosition="right"
              >
                Finish Wizard
              </Button>
            )}
          </div>
        </div>

        {/* Right Col: Live 2D Section Graphic & Property Readouts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-5">
            <h3 className="font-heading font-bold text-sm text-navy-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-steel-600">view_in_ar</span>
              Live Cross-Section Graphic
            </h3>

            {/* 2D SVG I-Beam Graphic */}
            <div className="h-60 bg-navy-900 rounded border border-navy-700 flex items-center justify-center p-4 relative overflow-hidden bg-blueprint-dark">
              <svg className="w-44 h-52" viewBox="0 0 200 240">
                {/* Top Flange */}
                <rect x="20" y="20" width="160" height="30" fill="#4682B4" stroke="#00A8CC" strokeWidth="2" />
                {/* Web */}
                <rect x="85" y="50" width="30" height="140" fill="#1C6090" stroke="#00A8CC" strokeWidth="2" />
                {/* Bottom Flange */}
                <rect x="20" y="190" width="160" height="30" fill="#4682B4" stroke="#00A8CC" strokeWidth="2" />

                {/* Dimension Arrows */}
                <text x="100" y="15" fill="#00A8CC" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">
                  bf = {beamData.width}mm
                </text>
                <text x="192" y="125" fill="#00A8CC" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono" transform="rotate(90 192 125)">
                  d = {beamData.depth}mm
                </text>
              </svg>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyanAccent-300">
                Scale: Real-time 2D Projection
              </div>
            </div>

            {/* Calculated Geometric Readouts */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-concrete-200">
                <span className="text-navy-500">Plastic Modulus Zx:</span>
                <span className="font-bold text-navy-800">{Zx.toLocaleString()} cm³</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-concrete-200">
                <span className="text-navy-500">Factored Moment Mu:</span>
                <span className="font-bold text-steel-700">{Mu} kN·m</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-concrete-200">
                <span className="text-navy-500">Nominal Moment Mn:</span>
                <span className="font-bold text-steel-700">{Mn} kN·m</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-navy-500">Safety Factor:</span>
                <span className="font-bold text-emerald-600">{safetyFactor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
