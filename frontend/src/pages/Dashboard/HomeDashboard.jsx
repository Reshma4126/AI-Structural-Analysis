import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import fetchApi from '../../services/api';
import { initialProjects } from '../../services/mockData';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/projects');
      if (Array.isArray(data) && data.length > 0) {
        setProjectsList(data);
      } else {
        setProjectsList(initialProjects);
      }
    } catch (err) {
      console.warn("Using initial projects fallback:", err);
      setProjectsList(initialProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects by search
  const filteredProjects = projectsList.filter(p =>
    (p.project_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || p.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify({
          project_name: newProjectName,
          description: newProjectDesc || 'Reinforced Concrete Beam Project'
        })
      });
      setShowNewProjectModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
    } catch (err) {
      alert(err.message || 'Failed to create project');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Workspace Greeting Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ACTIVE SESSION • {user?.company || 'Structura AI Platform'}
            </div>
            <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-navy-800 tracking-tight">
              Welcome back, {user?.name || 'Engineer'}
            </h1>
            <p className="text-xs lg:text-sm text-navy-500 mt-1">
              Select a project from your workspace or create a new one to begin structural modeling & analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon="add"
              onClick={() => setShowNewProjectModal(true)}
            >
              + New Project
            </Button>
          </div>
        </div>

        {/* Workflow Progression Guide */}
        <div className="bg-navy-800 text-white p-5 rounded border border-navy-700 shadow-md">
          <p className="text-xs font-mono text-cyanAccent-400 uppercase tracking-wider mb-3">
            Structural Engineering Workflow
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-heading">
            <div className="flex items-center gap-3 p-3 rounded bg-navy-900/60 border border-navy-700">
              <div className="w-7 h-7 rounded-full bg-steel-500 flex items-center justify-center font-bold text-white shrink-0">1</div>
              <div>
                <p className="font-bold text-white">Project Hub</p>
                <p className="text-[11px] text-navy-300 font-normal">Select or create a project workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded bg-navy-900/60 border border-navy-700">
              <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center font-bold text-navy-300 shrink-0">2</div>
              <div>
                <p className="font-bold text-white">Beam Models</p>
                <p className="text-[11px] text-navy-300 font-normal">Input geometry, material & loading</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded bg-navy-900/60 border border-navy-700">
              <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center font-bold text-navy-300 shrink-0">3</div>
              <div>
                <p className="font-bold text-white">Validate & Analyze</p>
                <p className="text-[11px] text-navy-300 font-normal">Run AI prediction & code checks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded bg-navy-900/60 border border-navy-700">
              <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center font-bold text-navy-300 shrink-0">4</div>
              <div>
                <p className="font-bold text-white">Comparison & Reports</p>
                <p className="text-[11px] text-navy-300 font-normal">Compare beams & export PDF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Search & Workspace Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-navy-800 tracking-tight">
                Recent Projects
              </h2>
              <p className="text-xs text-navy-500">
                Select a project to view details, configure beam members, or run analysis.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 transition shadow-sm"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="p-12 text-center text-navy-500 font-mono text-xs animate-pulse">
              Loading projects from database...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.project_id || project.id}
                  className="bg-white rounded border border-concrete-300 shadow-blueprint hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded bg-steel-50 border border-steel-200 flex items-center justify-center text-steel-600 font-bold shrink-0">
                        <span className="material-symbols-outlined text-xl">folder</span>
                      </div>
                      <Badge variant="cyan" size="sm">
                        {project.status || 'Active'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-base text-navy-800 group-hover:text-steel-600 transition-colors">
                        {project.project_name || project.name}
                      </h3>
                      <p className="text-xs text-navy-500 font-body mt-0.5">{project.description || project.type || 'Reinforced Concrete Structure'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-concrete-200 text-xs font-mono">
                      <div className="bg-concrete-50 p-2 rounded">
                        <span className="text-[10px] text-navy-400 block">ID</span>
                        <span className="font-bold text-navy-800">#{project.project_id || project.id}</span>
                      </div>
                      <div className="bg-concrete-50 p-2 rounded">
                        <span className="text-[10px] text-navy-400 block">STANDARD</span>
                        <span className="font-bold text-steel-700 truncate block">AISC 360-16 / Eurocode</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-concrete-50 border-t border-concrete-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-navy-400 text-[11px]">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Active Workspace'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="arrow_forward"
                      iconPosition="right"
                      onClick={() => navigate('/projects')}
                    >
                      Open Workspace →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-5 border border-concrete-300">
              <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
                <h3 className="font-heading font-bold text-lg text-navy-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-steel-500">add_location_alt</span>
                  Create New Project
                </h3>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-navy-400 hover:text-navy-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Commercial Office Block B"
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="e.g. Primary transfer girders and floor beams"
                    className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-concrete-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowNewProjectModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon="check"
                  >
                    Create Project in MySQL
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
