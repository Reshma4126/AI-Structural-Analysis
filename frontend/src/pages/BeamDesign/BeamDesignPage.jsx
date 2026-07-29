import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { projectsApi, beamsApi } from '../../services/api';

export default function BeamDesignPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Projects State
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(location.state?.projectId || '');
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Form State for Beam Input
  const [beamName, setBeamName] = useState('Beam B-101');
  const [width, setWidth] = useState(300); // b (mm)
  const [depth, setDepth] = useState(450); // h (mm)
  const [span, setSpan] = useState(5000); // L (mm)
  const [concreteStrength, setConcreteStrength] = useState(30); // fc (MPa)
  
  // Longitudinal Reinforcement
  const [numTensileBars, setNumTensileBars] = useState(4);
  const [diameterTensileBars, setDiameterTensileBars] = useState(20);
  const [fyLongitudinalBars, setFyLongitudinalBars] = useState(500); // fy (MPa)

  // Shear Reinforcement
  const [numStirrupLegs, setNumStirrupLegs] = useState(2);
  const [stirrupDiameter, setStirrupDiameter] = useState(8);
  const [stirrupSpacing, setStirrupSpacing] = useState(150); // s (mm)
  const [fyStirrupBars, setFyStirrupBars] = useState(415); // fyv (MPa)

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch projects on load
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const data = await projectsApi.getAll();
        const prjList = Array.isArray(data) ? data : [];
        setProjects(prjList);
        if (prjList.length > 0 && !selectedProjectId) {
          setSelectedProjectId(prjList[0].id);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // Derived Calculations
  const ast = (numTensileBars * Math.PI * Math.pow(diameterTensileBars, 2)) / 4;
  const reinforcementRatio = (width > 0 && depth > 0) ? ((ast / (width * depth)) * 100).toFixed(2) : '0.00';

  // Apply Presets
  const applyPreset = (preset) => {
    if (preset === 'small') {
      setWidth(200); setDepth(300); setSpan(3000); setConcreteStrength(20);
      setNumTensileBars(2); setDiameterTensileBars(12); setFyLongitudinalBars(415);
      setNumStirrupLegs(2); setStirrupDiameter(6); setStirrupSpacing(200); setFyStirrupBars(250);
    } else if (preset === 'medium') {
      setWidth(300); setDepth(450); setSpan(5000); setConcreteStrength(30);
      setNumTensileBars(4); setDiameterTensileBars(20); setFyLongitudinalBars(500);
      setNumStirrupLegs(2); setStirrupDiameter(8); setStirrupSpacing(150); setFyStirrupBars(415);
    } else if (preset === 'large') {
      setWidth(450); setDepth(750); setSpan(8000); setConcreteStrength(50);
      setNumTensileBars(8); setDiameterTensileBars(25); setFyLongitudinalBars(550);
      setNumStirrupLegs(4); setStirrupDiameter(10); setStirrupSpacing(100); setFyStirrupBars(500);
    }
  };

  const handleSaveAndAnalyze = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const beamParams = {
      width: parseFloat(width),
      depth: parseFloat(depth),
      span: parseFloat(span),
      concrete_strength: parseFloat(concreteStrength),
      num_tensile_bars: parseInt(numTensileBars),
      diameter_tensile_bars: parseInt(diameterTensileBars),
      tension_reinforcement_ratio: parseFloat(reinforcementRatio),
      num_stirrup_legs: parseInt(numStirrupLegs),
      stirrup_spacing: parseFloat(stirrupSpacing),
      stirrup_diameter: parseFloat(stirrupDiameter),
      fy_longitudinal_bars: parseFloat(fyLongitudinalBars),
      fy_stirrup_bars: parseFloat(fyStirrupBars)
    };

    try {
      if (selectedProjectId) {
        await beamsApi.create(selectedProjectId, {
          beam_name: beamName,
          beam_width: width,
          beam_depth: depth,
          beam_length: span / 1000,
          concrete_grade: `M${concreteStrength}`,
          steel_grade: `Fe${fyLongitudinalBars}`,
          number_of_tensile_bars: numTensileBars,
          diameter_tensile_bars: diameterTensileBars,
          stirrup_diameter: stirrupDiameter,
          stirrup_spacing: stirrupSpacing,
          applied_load: 30.0
        }).catch(err => console.warn('Beam save warning:', err));
      }

      // Automatic Redirect to Analysis Page with Beam Parameters attached
      navigate('/analysis', {
        state: {
          beamParams,
          beamName,
          autoRun: true
        }
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save beam data.');
      setSubmitting(false);
    }
  };

  const selectedProject = projects.find((p) => String(p.id) === String(selectedProjectId));

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-steel-500"></span>
            STEP 3 • BEAM INPUT
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-navy-900 tracking-tight">
            Beam Input
          </h1>
          <p className="text-xs text-navy-600 font-body leading-relaxed max-w-3xl">
            Configure the reinforced concrete beam geometry, material properties, reinforcement details, and loading parameters for AI structural analysis.
          </p>
        </div>

        {/* Project Context & Presets Bar */}
        <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-heading font-bold text-navy-700 uppercase shrink-0">
              Active Project:
            </span>
            {loadingProjects ? (
              <span className="text-xs font-mono text-navy-400">Loading projects...</span>
            ) : projects.length === 0 ? (
              <span className="text-xs font-mono text-amber-600 font-bold">No Active Projects</span>
            ) : (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full sm:w-72 px-3 py-1.5 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-medium focus:outline-none focus:ring-2 focus:ring-steel-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-navy-500">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('small')}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-concrete-100 hover:bg-steel-100 text-navy-800 rounded border border-concrete-300 transition"
            >
              Small (200x300)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('medium')}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-concrete-100 hover:bg-steel-100 text-navy-800 rounded border border-concrete-300 transition"
            >
              Medium (300x450)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('large')}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-concrete-100 hover:bg-steel-100 text-navy-800 rounded border border-concrete-300 transition"
            >
              Large (450x750)
            </button>
          </div>
        </div>

        {/* Empty State: If No Project Exists */}
        {!loadingProjects && projects.length === 0 ? (
          <div className="bg-white p-12 text-center rounded border border-concrete-300 shadow-blueprint space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <span className="material-symbols-outlined text-3xl">folder_open</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-navy-900">Create a project first before entering beam details.</h3>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                All beam input parameters are associated with a structural project workspace.
              </p>
            </div>
            <Button variant="primary" icon="add" onClick={() => navigate('/projects')}>
              Go to Projects & Create One
            </Button>
          </div>
        ) : (
          /* Beam Input Form */
          <form onSubmit={handleSaveAndAnalyze} className="space-y-6">
            
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded font-mono">
                {errorMsg}
              </div>
            )}

            <div className="bg-white rounded border border-concrete-300 shadow-blueprint p-6 space-y-6">
              
              {/* Beam Name */}
              <div>
                <label className="block text-xs font-heading font-bold text-navy-800 uppercase mb-1">
                  Beam Designation / Mark Name *
                </label>
                <input
                  type="text"
                  required
                  value={beamName}
                  onChange={(e) => setBeamName(e.target.value)}
                  placeholder="e.g. Beam B-101 (Transfer Girder)"
                  className="w-full max-w-md px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-900 font-bold focus:outline-none focus:ring-2 focus:ring-steel-500"
                />
              </div>

              {/* 1. Geometry Section */}
              <div className="space-y-3 pt-2 border-t border-concrete-200">
                <h3 className="text-sm font-heading font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-steel-500 pl-3">
                  <span className="material-symbols-outlined text-base text-steel-600">architecture</span>
                  1. Geometry Parameters
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Width (b, mm) *</label>
                    <input
                      type="number"
                      required
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Overall Depth (h, mm) *</label>
                    <input
                      type="number"
                      required
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Clear Span Length (L, mm) *</label>
                    <input
                      type="number"
                      required
                      value={span}
                      onChange={(e) => setSpan(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Concrete Section */}
              <div className="space-y-3 pt-4 border-t border-concrete-200">
                <h3 className="text-sm font-heading font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-cyanAccent-500 pl-3">
                  <span className="material-symbols-outlined text-base text-cyanAccent-600">science</span>
                  2. Concrete Specification
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Characteristic Strength (fc / fck, MPa) *</label>
                    <input
                      type="number"
                      required
                      value={concreteStrength}
                      onChange={(e) => setConcreteStrength(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Longitudinal Reinforcement Section */}
              <div className="space-y-3 pt-4 border-t border-concrete-200">
                <h3 className="text-sm font-heading font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                  <span className="material-symbols-outlined text-base text-amber-600">grid_guides</span>
                  3. Longitudinal Reinforcement Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Number of Tensile Bars (n) *</label>
                    <input
                      type="number"
                      required
                      value={numTensileBars}
                      onChange={(e) => setNumTensileBars(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Bar Diameter (db, mm) *</label>
                    <input
                      type="number"
                      required
                      value={diameterTensileBars}
                      onChange={(e) => setDiameterTensileBars(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Steel Yield Strength (fy, MPa) *</label>
                    <input
                      type="number"
                      required
                      value={fyLongitudinalBars}
                      onChange={(e) => setFyLongitudinalBars(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Shear Reinforcement Section */}
              <div className="space-y-3 pt-4 border-t border-concrete-200">
                <h3 className="text-sm font-heading font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                  <span className="material-symbols-outlined text-base text-emerald-600">hardware</span>
                  4. Shear Reinforcement Details
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Stirrup Legs *</label>
                    <input
                      type="number"
                      required
                      value={numStirrupLegs}
                      onChange={(e) => setNumStirrupLegs(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Stirrup Diameter (mm) *</label>
                    <input
                      type="number"
                      required
                      value={stirrupDiameter}
                      onChange={(e) => setStirrupDiameter(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">Stirrup Spacing (s, mm) *</label>
                    <input
                      type="number"
                      required
                      value={stirrupSpacing}
                      onChange={(e) => setStirrupSpacing(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-700 font-bold uppercase mb-1">fy Stirrup (fyv, MPa) *</label>
                    <input
                      type="number"
                      required
                      value={fyStirrupBars}
                      onChange={(e) => setFyStirrupBars(e.target.value)}
                      className="w-full p-2.5 bg-concrete-50 border border-concrete-300 rounded text-navy-900 font-bold focus:bg-white focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Auto-Calculated Derived Metrics */}
              <div className="p-4 bg-navy-50 rounded border border-concrete-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-navy-500 uppercase font-bold block">Auto-Calculated Steel Area (Ast)</span>
                  <span className="text-lg font-black text-navy-900">{ast.toFixed(1)} mm²</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-500 uppercase font-bold block">Reinforcement Ratio (ρ)</span>
                  <span className="text-lg font-black text-steel-700">{reinforcementRatio}%</span>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="pt-4 border-t border-concrete-200 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  icon="play_arrow"
                  disabled={submitting}
                >
                  {submitting ? 'Saving & Redirecting...' : 'Save & Analyze →'}
                </Button>
              </div>

            </div>
          </form>
        )}

      </div>
    </MainLayout>
  );
}
