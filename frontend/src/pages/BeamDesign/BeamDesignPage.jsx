import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { projectsApi, beamsApi } from '../../services/api';

export default function BeamDesignPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(location.state?.projectId || '');
  const [beams, setBeams] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBeams, setLoadingBeams] = useState(false);

  // Form / Edit Mode
  const [activeView, setActiveView] = useState('list'); // 'list' | 'form'
  const [editingBeamId, setEditingBeamId] = useState(null);
  const [activeTab, setActiveTab] = useState('geometry'); // 'geometry' | 'material' | 'reinforcement' | 'loading'

  // Beam Form Data
  const defaultBeamForm = {
    beam_name: '',
    beam_width: 300,
    beam_depth: 600,
    beam_length: 6.0,
    cover: 25,
    concrete_grade: 'M30',
    steel_grade: 'Fe500',
    number_of_tensile_bars: 4,
    diameter_tensile_bars: 20,
    number_of_compression_bars: 2,
    diameter_compression_bars: 12,
    stirrup_diameter: 8,
    stirrup_spacing: 150,
    loading_type: 'Uniformly Distributed Load (UDL)',
    applied_load: 25.0,
  };

  const [formData, setFormData] = useState(defaultBeamForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch projects on load
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const data = await projectsApi.getAll();
        setProjects(data || []);
        if (data && data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // Fetch beams whenever selected project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchBeams(selectedProjectId);
    } else {
      setBeams([]);
    }
  }, [selectedProjectId]);

  const fetchBeams = async (projectId) => {
    try {
      setLoadingBeams(true);
      const data = await beamsApi.getByProject(projectId);
      setBeams(data || []);
    } catch (err) {
      console.error('Failed to fetch beams:', err);
    } finally {
      setLoadingBeams(false);
    }
  };

  const handleStartAddBeam = () => {
    if (!selectedProjectId) {
      alert('Please select a project first.');
      return;
    }
    setEditingBeamId(null);
    setFormData({
      ...defaultBeamForm,
      beam_name: `Beam B-${beams.length + 101}`,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setActiveView('form');
    setActiveTab('geometry');
  };

  const handleStartEditBeam = (beam) => {
    setEditingBeamId(beam.id);
    setFormData({
      beam_name: beam.beam_name || '',
      beam_width: beam.beam_width || 300,
      beam_depth: beam.beam_depth || 600,
      beam_length: beam.beam_length || 6.0,
      cover: beam.cover || 25,
      concrete_grade: beam.concrete_grade || 'M30',
      steel_grade: beam.steel_grade || 'Fe500',
      number_of_tensile_bars: beam.number_of_tensile_bars || 4,
      diameter_tensile_bars: beam.diameter_tensile_bars || 20,
      number_of_compression_bars: beam.number_of_compression_bars || 2,
      diameter_compression_bars: beam.diameter_compression_bars || 12,
      stirrup_diameter: beam.stirrup_diameter || 8,
      stirrup_spacing: beam.stirrup_spacing || 150,
      loading_type: beam.loading_type || 'Uniformly Distributed Load (UDL)',
      applied_load: beam.applied_load || 25.0,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setActiveView('form');
    setActiveTab('geometry');
  };

  const handleDeleteBeam = async (beamId) => {
    if (!window.confirm('Are you sure you want to delete this beam design?')) return;
    try {
      await beamsApi.delete(beamId);
      fetchBeams(selectedProjectId);
    } catch (err) {
      alert(err.message || 'Failed to delete beam');
    }
  };

  const handleSaveBeam = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingBeamId) {
        await beamsApi.update(editingBeamId, formData);
        setSuccessMsg('✓ Beam design successfully updated.');
      } else {
        await beamsApi.create(selectedProjectId, formData);
        setSuccessMsg('✓ Beam design successfully created.');
      }

      fetchBeams(selectedProjectId);
      setTimeout(() => {
        setActiveView('list');
      }, 1200);
    } catch (err) {
      if (err.data?.errors) {
        setErrorMsg(err.data.errors.join(' '));
      } else {
        setErrorMsg(err.message || 'Failed to save beam data.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProject = projects.find((p) => String(p.id) === String(selectedProjectId));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-steel-600 font-bold uppercase mb-1">
              MODULE 3 • BEAM DATA MANAGEMENT
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
              Beam Member Repository & Inputs
            </h1>
            <p className="text-xs text-navy-500 mt-1">
              Select a project and configure geometric dimensions, material grades, reinforcement layout, and loading.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeView === 'form' ? (
              <Button
                variant="outline"
                icon="arrow_back"
                onClick={() => setActiveView('list')}
              >
                Back to Beam List
              </Button>
            ) : (
              <Button
                variant="primary"
                icon="add"
                onClick={handleStartAddBeam}
                disabled={!selectedProjectId}
              >
                + Add Beam
              </Button>
            )}
          </div>
        </div>

        {/* Project Selector Header */}
        <div className="bg-white p-4 rounded border border-concrete-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-heading font-bold text-navy-700 uppercase shrink-0">
              Active Project:
            </span>
            {loadingProjects ? (
              <span className="text-xs font-mono text-navy-400">Loading projects...</span>
            ) : (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full sm:w-72 px-3 py-1.5 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-medium focus:outline-none focus:ring-2 focus:ring-steel-500"
              >
                <option value="">-- Select a Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedProject && (
            <div className="text-xs font-mono text-navy-500">
              Project ID: <span className="font-bold text-navy-800">{selectedProject.id}</span>
            </div>
          )}
        </div>

        {/* View Switcher: Beam List or Beam Details Form */}
        {activeView === 'list' ? (
          /* BEAM LIST VIEW */
          <div className="bg-white rounded border border-concrete-300 shadow-blueprint p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
              <h2 className="text-lg font-heading font-bold text-navy-900">
                Beams in Selected Project ({beams.length})
              </h2>
              {selectedProjectId && (
                <Button
                  variant="primary"
                  size="sm"
                  icon="add"
                  onClick={handleStartAddBeam}
                >
                  Add Beam
                </Button>
              )}
            </div>

            {!selectedProjectId ? (
              <div className="py-12 text-center text-xs font-mono text-navy-400">
                Please select or create a project to view and manage beam members.
              </div>
            ) : loadingBeams ? (
              <div className="py-12 text-center text-xs font-mono text-navy-400">
                Loading beam models...
              </div>
            ) : beams.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-navy-300">architecture</span>
                <p className="text-sm font-heading font-semibold text-navy-700">No beams added yet</p>
                <p className="text-xs text-navy-500">Click "Add Beam" above to input parameters for your first beam.</p>
                <Button
                  variant="primary"
                  size="sm"
                  icon="add"
                  onClick={handleStartAddBeam}
                >
                  Add Beam
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead className="bg-navy-50 border-b border-concrete-200 font-heading font-bold text-navy-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Beam Name</th>
                      <th className="p-3">Dimensions (b x D x L)</th>
                      <th className="p-3">Grades (Conc / Steel)</th>
                      <th className="p-3">Reinforcement</th>
                      <th className="p-3">Applied Load</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-concrete-100 font-mono">
                    {beams.map((b) => (
                      <tr key={b.id} className="hover:bg-steel-50/50 transition">
                        <td className="p-3 font-heading font-bold text-navy-900 font-sans">
                          {b.beam_name}
                        </td>
                        <td className="p-3 text-navy-800">
                          {b.beam_width} × {b.beam_depth} mm (L={b.beam_length}m)
                        </td>
                        <td className="p-3 text-navy-800">
                          {b.concrete_grade} / {b.steel_grade}
                        </td>
                        <td className="p-3 text-navy-700">
                          {b.number_of_tensile_bars}T{b.diameter_tensile_bars} Bottom, {b.number_of_compression_bars}T{b.diameter_compression_bars} Top
                        </td>
                        <td className="p-3 text-steel-700 font-bold">
                          {b.applied_load} kN ({b.loading_type?.split(' ')[0]})
                        </td>
                        <td className="p-3 text-right font-sans flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEditBeam(b)}
                            className="p-1 rounded text-navy-500 hover:text-steel-600 hover:bg-concrete-100 transition"
                            title="Edit Beam Details"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBeam(b.id)}
                            className="p-1 rounded text-navy-500 hover:text-red-600 hover:bg-concrete-100 transition"
                            title="Delete Beam"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* BEAM DETAILS FORM VIEW */
          <form onSubmit={handleSaveBeam} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-300 rounded text-xs text-red-700 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden flex flex-col">
              {/* Section Tabs */}
              <div className="flex border-b border-concrete-200 bg-concrete-50 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('geometry')}
                  className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    activeTab === 'geometry'
                      ? 'border-steel-500 text-steel-600 bg-white'
                      : 'border-transparent text-navy-500 hover:text-navy-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">architecture</span>
                  1. Geometry & Cover
                </button>
                <button
                  type="button"
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
                  type="button"
                  onClick={() => setActiveTab('reinforcement')}
                  className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    activeTab === 'reinforcement'
                      ? 'border-steel-500 text-steel-600 bg-white'
                      : 'border-transparent text-navy-500 hover:text-navy-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">grid_4x4</span>
                  3. Reinforcement Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('loading')}
                  className={`px-5 py-3 text-xs font-heading font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    activeTab === 'loading'
                      ? 'border-steel-500 text-steel-600 bg-white'
                      : 'border-transparent text-navy-500 hover:text-navy-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  4. Loading Information
                </button>
              </div>

              {/* Form Content Body */}
              <div className="p-6 space-y-6 flex-1">
                {activeTab === 'geometry' && (
                  <div className="space-y-5">
                    <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                      Beam Identifier & Geometric Dimensions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Beam Name / Designation *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.beam_name}
                          onChange={(e) => setFormData({ ...formData, beam_name: e.target.value })}
                          placeholder="e.g. Beam B-101"
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Span Length (m) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={formData.beam_length}
                          onChange={(e) => setFormData({ ...formData, beam_length: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Section Width b (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.beam_width}
                          onChange={(e) => setFormData({ ...formData, beam_width: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Overall Depth D (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.beam_depth}
                          onChange={(e) => setFormData({ ...formData, beam_depth: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Nominal Cover (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.cover}
                          onChange={(e) => setFormData({ ...formData, cover: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'material' && (
                  <div className="space-y-5">
                    <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                      Material Grades & Specification
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Concrete Grade *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.concrete_grade}
                          onChange={(e) => setFormData({ ...formData, concrete_grade: e.target.value })}
                          placeholder="e.g. M30 or C30/37"
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Steel Rebar Grade *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.steel_grade}
                          onChange={(e) => setFormData({ ...formData, steel_grade: e.target.value })}
                          placeholder="e.g. Fe500 or Grade 60"
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reinforcement' && (
                  <div className="space-y-5">
                    <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                      Longitudinal & Shear Reinforcement Layout
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Number of Tensile Bars *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.number_of_tensile_bars}
                          onChange={(e) => setFormData({ ...formData, number_of_tensile_bars: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Tensile Bar Diameter (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.diameter_tensile_bars}
                          onChange={(e) => setFormData({ ...formData, diameter_tensile_bars: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Number of Compression Bars *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.number_of_compression_bars}
                          onChange={(e) => setFormData({ ...formData, number_of_compression_bars: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Compression Bar Diameter (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.diameter_compression_bars}
                          onChange={(e) => setFormData({ ...formData, diameter_compression_bars: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Stirrup Diameter (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.stirrup_diameter}
                          onChange={(e) => setFormData({ ...formData, stirrup_diameter: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Stirrup Spacing (mm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.stirrup_spacing}
                          onChange={(e) => setFormData({ ...formData, stirrup_spacing: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'loading' && (
                  <div className="space-y-5">
                    <h3 className="font-heading font-bold text-sm text-navy-900 border-b border-concrete-200 pb-2">
                      Loading Information & Design Conditions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Loading Type *
                        </label>
                        <select
                          value={formData.loading_type}
                          onChange={(e) => setFormData({ ...formData, loading_type: e.target.value })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:ring-2 focus:ring-steel-500"
                        >
                          <option value="Uniformly Distributed Load (UDL)">Uniformly Distributed Load (UDL)</option>
                          <option value="Point Load at Midspan">Point Load at Midspan</option>
                          <option value="Combined UDL & Point Load">Combined UDL & Point Load</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                          Applied Load (kN or kN/m) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={formData.applied_load}
                          onChange={(e) => setFormData({ ...formData, applied_load: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:ring-2 focus:ring-steel-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action Footer */}
              <div className="p-4 bg-concrete-50 border-t border-concrete-200 flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveView('list')}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon="save"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingBeamId ? 'Update Beam Data' : 'Save Beam Data'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
