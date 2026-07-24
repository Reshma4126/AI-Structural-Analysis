import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { initialProjects } from '../../services/mockData';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    type: 'High-Rise Steel Core',
    location: '',
    code: 'AISC 360-16 LRFD',
    description: '',
  });

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    const created = {
      id: `PRJ-2026-00${projects.length + 1}`,
      ...newProject,
      status: 'In Review',
      healthScore: 95,
      beamsCount: 12,
      lastModified: 'Just now',
      author: 'Eleanor Vance',
      safetyFactor: 1.45,
      weightSavings: '15.0%',
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80',
    };
    setProjects([created, ...projects]);
    setIsModalOpen(false);
    setNewProject({ name: '', type: 'High-Rise Steel Core', location: '', code: 'AISC 360-16 LRFD', description: '' });
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
            Manage project repositories, structural design codes, and beam optimization calculation sheets.
          </p>
        </div>

        <Button
          variant="primary"
          icon="add"
          onClick={() => setIsModalOpen(true)}
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
            placeholder="Search by project title, type, or location..."
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

      {/* Active Selected Project Cockpit View */}
      {projects.length > 0 && (
        <div className="bg-white rounded-lg border border-concrete-300 shadow-blueprint p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
                <span className="w-2 h-2 rounded-full bg-cyanAccent-500 animate-pulse"></span>
                ACTIVE PROJECT WORKSPACE
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
                Project: {projects[0].name}
              </h2>
              <p className="text-xs text-navy-500 font-mono mt-0.5">
                {projects[0].id} • {projects[0].type} • {projects[0].code}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                icon="architecture"
                onClick={() => navigate('/beam-design')}
              >
                Continue Input →
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Completion Checklist */}
            <div className="lg:col-span-2 bg-concrete-50 p-5 rounded-lg border border-concrete-200 space-y-4">
              <h3 className="text-sm font-heading font-bold text-navy-800 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-steel-600 text-lg">fact_check</span>
                Model Input Checklist Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 p-3 bg-white rounded border border-concrete-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                  <div>
                    <p className="font-heading font-bold text-navy-800">Beam Created</p>
                    <p className="text-[11px] text-navy-500">Member ID: B-104 Transfer Girder</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded border border-concrete-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                  <div>
                    <p className="font-heading font-bold text-navy-800">Geometry Completed</p>
                    <p className="text-[11px] text-navy-500">Span: 12.5m, Section: 540x230mm</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded border border-concrete-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                  <div>
                    <p className="font-heading font-bold text-navy-800">Material Completed</p>
                    <p className="text-[11px] text-navy-500">Concrete C35/45, Steel Fe500</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded border border-concrete-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                  <div>
                    <p className="font-heading font-bold text-navy-800">Reinforcement Completed</p>
                    <p className="text-[11px] text-navy-500">4T25 Bottom, 2T16 Top, 8mm Shear</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded border border-amber-200 sm:col-span-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">⚠</span>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-amber-900">Loads Input Pending</p>
                      <p className="text-[11px] text-amber-700">Enter dead load, live load, and point forces to unlock AI prediction.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/beam-design')}
                    >
                      Complete Inputs
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Availability Guard Banner */}
            <div className="bg-navy-900 text-white p-5 rounded-lg border border-navy-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-cyanAccent-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-lg">lock</span>
                  AI Analysis Status
                </div>
                <h4 className="font-heading font-bold text-base text-white">
                  Analysis Engine Gated
                </h4>
                <p className="text-xs text-navy-200 leading-relaxed mt-1">
                  AI prediction, health scoring, and SHAP explainability insights remain unavailable until all loading and material parameters are validated.
                </p>
              </div>

              <div className="pt-3 border-t border-navy-700">
                <Button
                  variant="accent"
                  size="sm"
                  className="w-full justify-center opacity-80"
                  icon="play_arrow"
                  onClick={() => navigate('/beam-design')}
                >
                  Enter Inputs to Unlock Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Display Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              className="bg-white rounded border border-concrete-300 shadow-blueprint hover:border-steel-400 transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Thumbnail Image */}
              <div className="h-44 bg-navy-900 relative overflow-hidden">
                <img
                  src={prj.thumbnail}
                  alt={prj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant={prj.status === 'Approved' ? 'green' : 'cyan'}>
                    {prj.status}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-steel-600">
                    <span>{prj.id}</span>
                    <span>{prj.code}</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-navy-900 mt-1 group-hover:text-steel-600 transition">
                    {prj.name}
                  </h3>
                  <p className="text-xs text-navy-500 line-clamp-2 mt-1 leading-relaxed">
                    {prj.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-concrete-50 rounded border border-concrete-200 text-center text-xs font-mono">
                  <div>
                    <span className="text-navy-400 text-[9px] block">MEMBERS</span>
                    <span className="font-bold text-navy-800">{prj.beamsCount}</span>
                  </div>
                  <div>
                    <span className="text-navy-400 text-[9px] block">TYPE</span>
                    <span className="font-bold text-steel-700 truncate block">{prj.type}</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-concrete-200 flex items-center justify-between">
                  <span className="text-[11px] text-navy-400 font-mono">
                    Updated {prj.lastModified}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="arrow_forward"
                    onClick={() => navigate('/beam-design')}
                  >
                    Continue →
                  </Button>
                </div>
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
                <th className="p-4">Structural Code</th>
                <th className="p-4">Beams Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-100">
              {filteredProjects.map((prj) => (
                <tr key={prj.id} className="hover:bg-steel-50/50 transition">
                  <td className="p-4 font-heading font-bold text-navy-900">
                    <div>{prj.name}</div>
                    <div className="text-[10px] font-mono text-navy-400 font-normal">{prj.id} • {prj.location}</div>
                  </td>
                  <td className="p-4 font-mono text-navy-600">{prj.code}</td>
                  <td className="p-4 font-mono text-navy-800">{prj.beamsCount} members</td>
                  <td className="p-4">
                    <Badge variant={prj.status === 'Approved' ? 'green' : 'cyan'}>
                      {prj.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="open_in_new"
                      onClick={() => navigate('/beam-design')}
                    >
                      Open Workspace
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project Workspace"
        subtitle="Initialize a new structural calculation repository"
        icon="create_new_folder"
        primaryActionText="Create Workspace"
        onPrimaryAction={handleCreateProject}
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hudson Yards Tower B Transfer Truss"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                Structure Type
              </label>
              <select
                value={newProject.type}
                onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
              >
                <option value="High-Rise Steel Core">High-Rise Steel Core</option>
                <option value="Bridge Deck Expansion">Bridge Deck Expansion</option>
                <option value="Long-Span Roof Truss">Long-Span Roof Truss</option>
                <option value="Commercial Atrium">Commercial Atrium</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                Design Standard
              </label>
              <select
                value={newProject.code}
                onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 font-mono"
              >
                <option value="AISC 360-16 LRFD">AISC 360-16 LRFD</option>
                <option value="Eurocode 3 (EN 1993)">Eurocode 3 (EN 1993)</option>
                <option value="AASHTO LRFD-9">AASHTO LRFD-9</option>
                <option value="ACI 318-19">ACI 318-19</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
              Project Location
            </label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              value={newProject.location}
              onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
              Scope Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter design assumptions, load conditions, or architectural constraints..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500"
            />
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
