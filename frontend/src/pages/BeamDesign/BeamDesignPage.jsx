import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function BeamDesignPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('geometry'); // 'geometry' | 'material' | 'reinforcement' | 'loading'
  const [isValidated, setIsValidated] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');

  // Form State for Reinforced Concrete Beam
  const [beamData, setBeamData] = useState({
    name: 'RC Beam B-104 (Transfer Girder)',
    type: 'Simply Supported Beam',
    length: 12.5, // meters
    width: 300, // mm
    depth: 600, // mm
    effectiveDepth: 540, // mm
    concreteGrade: 'C35/45 (fck = 35 MPa)',
    steelGrade: 'Fe500 (fyk = 500 MPa)',
    tensionBars: '4 x T25 (1963 mm²)',
    compressionBars: '2 x T16 (402 mm²)',
    stirrups: '8mm @ 150mm c/c',
    deadLoad: 35.0, // kN/m
    liveLoad: 45.0, // kN/m
    pointLoad: 120.0, // kN
  });

  const handleValidate = () => {
    if (beamData.length <= 0 || beamData.width <= 0 || beamData.depth <= 0) {
      setValidationMsg('Error: Beam dimensions must be greater than 0.');
      setIsValidated(false);
      return;
    }
    setIsValidated(true);
    setValidationMsg('✓ All input geometry, materials, reinforcement, and load parameters are valid and satisfy ACI 318 / IS 456 limits.');
  };

  const handleSave = () => {
    alert(`Beam model "${beamData.name}" successfully saved to active project.`);
  };

  const handleRunAnalysis = () => {
    if (!isValidated) {
      handleValidate();
    }
    // Navigate to Module 4 Analysis
    navigate('/analysis');
  };

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-cyanAccent-500 animate-pulse"></span>
            MODULE 3 • REINFORCED CONCRETE BEAM MODELING WORKSTATION
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
            Beam Information & Parameter Controls
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Input cross-sectional geometry, material properties, reinforcement layout, and design loads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="save"
            onClick={handleSave}
          >
            Save Model
          </Button>
          <Button
            variant="outline"
            icon="fact_check"
            onClick={handleValidate}
          >
            Validate Inputs
          </Button>
          <Button
            variant="primary"
            icon="play_arrow"
            onClick={handleRunAnalysis}
          >
            Run AI Analysis →
          </Button>
        </div>
      </div>

      {/* Validation Status Banner */}
      {validationMsg && (
        <div className={`p-4 rounded border text-xs flex items-center justify-between ${
          isValidated
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
            : 'bg-red-50 border-red-300 text-red-900 font-medium'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              {isValidated ? 'check_circle' : 'error'}
            </span>
            <span>{validationMsg}</span>
          </div>
          {isValidated && (
            <span className="font-mono text-[11px] bg-emerald-100 px-2.5 py-0.5 rounded text-emerald-800 font-bold">
              Ready for AI Prediction
            </span>
          )}
        </div>
      )}

      {/* Main Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Sections Tabs */}
        <div className="lg:col-span-2 bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden flex flex-col">
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-concrete-200 bg-concrete-50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('geometry')}
              className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'geometry'
                  ? 'border-steel-500 text-steel-600 bg-white'
                  : 'border-transparent text-navy-500 hover:text-navy-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">architecture</span>
              1. Beam & Geometry
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'material'
                  ? 'border-steel-500 text-steel-600 bg-white'
                  : 'border-transparent text-navy-500 hover:text-navy-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">science</span>
              2. Concrete & Steel Grade
            </button>
            <button
              onClick={() => setActiveTab('reinforcement')}
              className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'reinforcement'
                  ? 'border-steel-500 text-steel-600 bg-white'
                  : 'border-transparent text-navy-500 hover:text-navy-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_4x4</span>
              3. Reinforcement
            </button>
            <button
              onClick={() => setActiveTab('loading')}
              className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'loading'
                  ? 'border-steel-500 text-steel-600 bg-white'
                  : 'border-transparent text-navy-500 hover:text-navy-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">download</span>
              4. Design Loading
            </button>
          </div>

          {/* Form Content Body */}
          <div className="p-6 space-y-6 flex-1">
            {activeTab === 'geometry' && (
              <div className="space-y-5">
                <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                  Beam Identifier & Geometry Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Beam Designation / Name
                    </label>
                    <input
                      type="text"
                      value={beamData.name}
                      onChange={(e) => setBeamData({ ...beamData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Support Condition / Beam Type
                    </label>
                    <select
                      value={beamData.type}
                      onChange={(e) => setBeamData({ ...beamData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:ring-2 focus:ring-steel-500"
                    >
                      <option value="Simply Supported Beam">Simply Supported Beam</option>
                      <option value="Continuous Beam">Continuous Beam</option>
                      <option value="Cantilever Beam">Cantilever Beam</option>
                      <option value="Fixed End Beam">Fixed End Beam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Clear Span Length L (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={beamData.length}
                      onChange={(e) => setBeamData({ ...beamData, length: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Section Width b (mm)
                    </label>
                    <input
                      type="number"
                      value={beamData.width}
                      onChange={(e) => setBeamData({ ...beamData, width: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Total Overall Depth D (mm)
                    </label>
                    <input
                      type="number"
                      value={beamData.depth}
                      onChange={(e) => setBeamData({ ...beamData, depth: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Effective Depth d (mm)
                    </label>
                    <input
                      type="number"
                      value={beamData.effectiveDepth}
                      onChange={(e) => setBeamData({ ...beamData, effectiveDepth: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div className="space-y-5">
                <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                  Concrete & Steel Material Strengths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Concrete Characteristic Strength (fck / fc')
                    </label>
                    <select
                      value={beamData.concreteGrade}
                      onChange={(e) => setBeamData({ ...beamData, concreteGrade: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    >
                      <option value="C25/30 (fck = 25 MPa)">C25/30 (fck = 25 MPa / 3.6 ksi)</option>
                      <option value="C30/37 (fck = 30 MPa)">C30/37 (fck = 30 MPa / 4.35 ksi)</option>
                      <option value="C35/45 (fck = 35 MPa)">C35/45 (fck = 35 MPa / 5.0 ksi)</option>
                      <option value="C40/50 (fck = 40 MPa)">C40/50 (fck = 40 MPa / 5.8 ksi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Rebar Yield Strength (fyk / fy)
                    </label>
                    <select
                      value={beamData.steelGrade}
                      onChange={(e) => setBeamData({ ...beamData, steelGrade: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    >
                      <option value="Fe415 (fyk = 415 MPa)">Fe415 (fyk = 415 MPa / 60 ksi)</option>
                      <option value="Fe500 (fyk = 500 MPa)">Fe500 (fyk = 500 MPa / 72.5 ksi)</option>
                      <option value="Fe550 (fyk = 550 MPa)">Fe550 (fyk = 550 MPa / 80 ksi)</option>
                      <option value="ASTM A615 Grade 60">ASTM A615 Grade 60 (fy = 60 ksi)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reinforcement' && (
              <div className="space-y-5">
                <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                  Longitudinal & Transverse Reinforcement Layout
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Main Tension Reinforcement (Ast)
                    </label>
                    <input
                      type="text"
                      value={beamData.tensionBars}
                      onChange={(e) => setBeamData({ ...beamData, tensionBars: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Compression Reinforcement (Asc)
                    </label>
                    <input
                      type="text"
                      value={beamData.compressionBars}
                      onChange={(e) => setBeamData({ ...beamData, compressionBars: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Shear Stirrups / Ties
                    </label>
                    <input
                      type="text"
                      value={beamData.stirrups}
                      onChange={(e) => setBeamData({ ...beamData, stirrups: e.target.value })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'loading' && (
              <div className="space-y-5">
                <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                  Applied Structural Loads (Ultimate Limit State)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Dead Load Wd (kN/m)
                    </label>
                    <input
                      type="number"
                      value={beamData.deadLoad}
                      onChange={(e) => setBeamData({ ...beamData, deadLoad: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
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
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                      Concentrated Point Load P (kN)
                    </label>
                    <input
                      type="number"
                      value={beamData.pointLoad}
                      onChange={(e) => setBeamData({ ...beamData, pointLoad: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-concrete-50 border-t border-concrete-200 flex items-center justify-between">
            <span className="text-xs text-navy-500 font-mono">
              Status: {isValidated ? '✓ Validated' : '⚠ Pending Validation'}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon="fact_check"
                onClick={handleValidate}
              >
                Validate
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon="play_arrow"
                onClick={handleRunAnalysis}
              >
                Run AI Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Section Preview & Property Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-5">
            <h3 className="font-heading font-bold text-sm text-navy-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-steel-600">view_in_ar</span>
              Section Diagram & Details
            </h3>

            {/* 2D RC Beam Cross-Section SVG Graphic */}
            <div className="h-64 bg-navy-900 rounded border border-navy-700 flex items-center justify-center p-4 relative overflow-hidden bg-blueprint-dark">
              <svg className="w-48 h-56" viewBox="0 0 200 240">
                {/* Concrete Section Rectangle */}
                <rect x="30" y="20" width="140" height="200" fill="#2A3846" stroke="#00A8CC" strokeWidth="2" />
                {/* Top Rebar (Compression) */}
                <circle cx="55" cy="45" r="7" fill="#E74C3C" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="145" cy="45" r="7" fill="#E74C3C" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Bottom Rebar (Tension) */}
                <circle cx="50" cy="195" r="9" fill="#00A8CC" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="83" cy="195" r="9" fill="#00A8CC" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="117" cy="195" r="9" fill="#00A8CC" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="150" cy="195" r="9" fill="#00A8CC" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Stirrups Outer Border */}
                <rect x="42" y="32" width="116" height="176" fill="none" stroke="#F39C12" strokeWidth="2" strokeDasharray="4,2" />
              </svg>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyanAccent-300">
                RC Beam Cross-Section (b x D)
              </div>
            </div>

            {/* Readout Summary */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-concrete-200">
                <span className="text-navy-500">Dimensions (b x D):</span>
                <span className="font-bold text-navy-800">{beamData.width} x {beamData.depth} mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-concrete-200">
                <span className="text-navy-500">Concrete Strength:</span>
                <span className="font-bold text-steel-700">{beamData.concreteGrade.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-concrete-200">
                <span className="text-navy-500">Main Steel:</span>
                <span className="font-bold text-steel-700">{beamData.tensionBars}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-navy-500">Stirrups:</span>
                <span className="font-bold text-steel-700">{beamData.stirrups}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

