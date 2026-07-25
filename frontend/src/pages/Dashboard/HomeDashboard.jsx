import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { projectsApi } from '../../services/api';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      await projectsApi.create({
        project_name: newProjectName,
        description: newProjectDesc,
      });
      setNewProjectName('');
      setNewProjectDesc('');
      setShowNewProjectModal(false);
      fetchProjects();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatLastModified = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 24) return 'Today';
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-navy-800 tracking-tight">
              Welcome back, {user?.name || 'Engineer'}
            </h1>
            <p className="text-xs lg:text-sm text-navy-500 mt-1">
              Select a project from your workspace or create a new one to begin beam modeling.
            </p>
          </div>

          <Button
            variant="primary"
            icon="add"
            onClick={() => setShowNewProjectModal(true)}
          >
            + New Project
          </Button>
        </div>

        {/* Recent Projects Section */}
        <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
            <h2 className="text-xl font-heading font-extrabold text-navy-800 tracking-tight">
              Recent Projects
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              View All Projects →
            </Button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-navy-400">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-navy-300">folder_open</span>
              <p className="text-sm font-heading font-semibold text-navy-700">No projects found</p>
              <p className="text-xs text-navy-500">Create your first structural engineering project to get started.</p>
              <Button
                variant="primary"
                size="sm"
                icon="add"
                onClick={() => setShowNewProjectModal(true)}
              >
                Create Project
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-concrete-200">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-concrete-50 px-3 rounded transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-steel-50 border border-steel-200 flex items-center justify-center text-steel-600 font-bold shrink-0">
                      <span className="material-symbols-outlined text-xl">folder</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-navy-900">
                        {project.project_name}
                      </h3>
                      <p className="text-xs text-navy-500 font-mono mt-0.5">
                        Last Modified: {formatLastModified(project.updated_at || project.created_at)}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon="arrow_forward"
                    iconPosition="right"
                    onClick={() => navigate('/beam-design', { state: { projectId: project.id } })}
                  >
                    Open →
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
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

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Residential Building"
                  className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Structural description or notes..."
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
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
