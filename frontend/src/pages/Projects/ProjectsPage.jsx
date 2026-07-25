import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { projectsApi } from '../../services/api';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    status: 'Active',
  });
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

  const filteredProjects = projects.filter(p =>
    (p.project_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({ project_name: '', description: '', status: 'Active' });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prj) => {
    setEditingProject(prj);
    setFormData({
      project_name: prj.project_name || '',
      description: prj.description || '',
      status: prj.status || 'Active',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project_name.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, formData);
      } else {
        await projectsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete/archive this project?')) return;
    try {
      await projectsApi.delete(id);
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
            PORTFOLIO MANAGER • {projects.length} ACTIVE PROJECTS
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            Structural Engineering Workspaces
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Manage your structural calculation repositories and project beam models.
          </p>
        </div>

        <Button
          variant="primary"
          icon="add"
          onClick={handleOpenCreateModal}
        >
          Create New Project
        </Button>
      </div>

      {/* Filter and View Control Bar */}
      <div className="bg-white p-4 rounded border border-concrete-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-concrete-100 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-navy-500">View:</span>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded border transition ${
              viewMode === 'grid'
                ? 'bg-steel-500 text-white border-steel-500'
                : 'bg-white text-navy-600 border-concrete-300 hover:bg-concrete-100'
            }`}
            title="Grid View"
          >
            <span className="material-symbols-outlined text-lg">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded border transition ${
              viewMode === 'list'
                ? 'bg-steel-500 text-white border-steel-500'
                : 'bg-white text-navy-600 border-concrete-300 hover:bg-concrete-100'
            }`}
            title="List View"
          >
            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-navy-400 bg-white rounded border border-concrete-300">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white p-12 rounded border border-concrete-300 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-navy-300">folder_off</span>
          <p className="text-sm font-heading font-semibold text-navy-700">No projects found</p>
          <p className="text-xs text-navy-500">Create a new project workspace to start creating beam models.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              className="bg-white rounded border border-concrete-300 shadow-blueprint hover:border-steel-400 transition-all duration-200 flex flex-col justify-between overflow-hidden group p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded bg-steel-50 border border-steel-200 flex items-center justify-center text-steel-600 font-bold shrink-0">
                    <span className="material-symbols-outlined text-xl">folder</span>
                  </div>
                  <Badge variant={prj.status === 'Completed' ? 'green' : 'cyan'}>
                    {prj.status || 'Active'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-bold text-navy-900 group-hover:text-steel-600 transition">
                    {prj.project_name}
                  </h3>
                  <p className="text-xs text-navy-500 line-clamp-2 mt-1 leading-relaxed">
                    {prj.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-3 border-t border-concrete-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(prj)}
                    className="p-1 rounded text-navy-500 hover:text-steel-600 hover:bg-concrete-100 transition"
                    title="Edit Project"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(prj.id)}
                    className="p-1 rounded text-navy-500 hover:text-red-600 hover:bg-concrete-100 transition"
                    title="Delete Project"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon="arrow_forward"
                  onClick={() => navigate('/beam-design', { state: { projectId: prj.id } })}
                >
                  Open →
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-navy-50 border-b border-concrete-200 font-heading font-bold text-navy-700 uppercase tracking-wider">
              <tr>
                <th className="p-4">Project Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-100">
              {filteredProjects.map((prj) => (
                <tr key={prj.id} className="hover:bg-steel-50/50 transition">
                  <td className="p-4 font-heading font-bold text-navy-900">
                    {prj.project_name}
                  </td>
                  <td className="p-4 text-navy-600 truncate max-w-xs">{prj.description || '—'}</td>
                  <td className="p-4">
                    <Badge variant={prj.status === 'Completed' ? 'green' : 'cyan'}>
                      {prj.status || 'Active'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditModal(prj)}
                      className="p-1 rounded text-navy-500 hover:text-steel-600 hover:bg-concrete-100 transition"
                      title="Edit Project"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(prj.id)}
                      className="p-1 rounded text-navy-500 hover:text-red-600 hover:bg-concrete-100 transition"
                      title="Delete Project"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="open_in_new"
                      onClick={() => navigate('/beam-design', { state: { projectId: prj.id } })}
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project Workspace'}
        subtitle="Configure your project workspace details"
        icon="folder"
        primaryActionText={editingProject ? 'Save Changes' : 'Create Workspace'}
        onPrimaryAction={handleSubmit}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Residential Building Block A"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            >
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
              Scope Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter design assumptions, load conditions, or architectural constraints..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            />
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
