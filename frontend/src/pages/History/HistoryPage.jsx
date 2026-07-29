import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAnalysis } from '../../context/AnalysisContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { historyList, loadAnalysisRecord, deleteAnalysisRecord } = useAnalysis();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleOpenRecord = (id) => {
    loadAnalysisRecord(id);
    navigate('/analysis');
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete analysis record #${id}?`)) {
      deleteAnalysisRecord(id);
    }
  };

  const filteredList = historyList.filter(item => {
    const matchesSearch = 
      (item.beamName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (item.beam_health_score >= 85 ? 'PASS' : 'WARNING') === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const timeA = new Date(a.createdAt || Date.now()).getTime();
    const timeB = new Date(b.createdAt || Date.now()).getTime();
    return sortOrder === 'oldest' ? timeA - timeB : timeB - timeA;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const currentItems = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (score) => {
    if (score >= 85) return <Badge variant="green">PASS</Badge>;
    if (score >= 70) return <Badge variant="cyan font-bold">WARNING</Badge>;
    return <Badge variant="red font-bold">CRITICAL</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-300 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent-600 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-cyanAccent-500"></span>
              PROJECT AUDIT TRAIL • PERMANENT EXECUTION ARCHIVE
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-900 tracking-tight">
              Structural Analysis History
            </h1>
            <p className="text-xs text-navy-500 mt-0.5">
              Review, filter, and audit past AI execution runs across structural projects.
            </p>
          </div>

          <Button variant="accent" icon="play_arrow" onClick={() => navigate('/analysis')}>
            Run New Analysis
          </Button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-navy-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search by beam name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-900 font-body"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-navy-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-concrete-50 border border-concrete-300 rounded text-xs px-3 py-1.5 font-mono text-navy-800"
              >
                <option value="ALL">All Statuses</option>
                <option value="PASS">PASS Only</option>
                <option value="WARNING">WARNING Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-navy-500">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-concrete-50 border border-concrete-300 rounded text-xs px-3 py-1.5 font-mono text-navy-800"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table Container */}
        <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
          {currentItems.length === 0 ? (
            /* Clean Engineering Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-cyanAccent-50 border border-cyanAccent-200 flex items-center justify-center text-cyanAccent-600 mx-auto">
                <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-navy-800">No analyses available</h3>
                <p className="text-xs text-navy-500">Run your first beam analysis to see prediction history.</p>
              </div>
              <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/analysis')}>
                Run Beam Analysis
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-navy-50 font-heading font-bold text-[11px] text-navy-700 uppercase border-b border-concrete-200">
                  <tr>
                    <th className="p-3.5">Analysis ID / Date</th>
                    <th className="p-3.5">Beam Designation</th>
                    <th className="p-3.5 text-center">Health Score</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Pmax (kN)</th>
                    <th className="p-3.5">Δult (mm)</th>
                    <th className="p-3.5">Failure Mode</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-concrete-200 text-xs font-mono">
                  {currentItems.map((item) => (
                    <tr key={item.analysisId} className="hover:bg-steel-50/50 transition-colors">
                      <td className="p-3.5 text-navy-600">
                        <div className="font-bold text-navy-900">#{item.analysisId}</div>
                        <div className="text-[10px] text-navy-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-navy-900">
                        {item.beamName}
                      </td>
                      <td className="p-3.5 text-center font-extrabold text-navy-900">
                        <span className={`inline-block px-2 py-0.5 rounded ${
                          (item.beam_health_score ?? 85) >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.beam_health_score}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(item.beam_health_score)}
                      </td>
                      <td className="p-3.5 font-bold text-navy-900">
                        {item.prediction?.pmax ?? '--'} kN
                      </td>
                      <td className="p-3.5 font-bold text-navy-900">
                        {item.prediction?.delta_ult ?? '--'} mm
                      </td>
                      <td className="p-3.5 text-navy-700">
                        {item.prediction?.failure_mode ?? 'Flexural'}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRecord(item.analysisId)}
                            className="p-1.5 text-navy-600 hover:text-steel-600 hover:bg-concrete-100 rounded transition font-bold flex items-center gap-1 text-[11px]"
                            title="Re-Open Analysis"
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                            Re-Open
                          </button>
                          <button
                            onClick={() => handleDelete(item.analysisId)}
                            className="p-1.5 text-navy-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete Record"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-3.5 bg-navy-50/50 border-t border-concrete-200 flex items-center justify-between font-mono text-xs">
              <span className="text-navy-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredList.length)} of {filteredList.length} runs
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded bg-white border border-concrete-300 text-navy-700 hover:bg-concrete-100 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-3 py-1 font-bold text-navy-900">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded bg-white border border-concrete-300 text-navy-700 hover:bg-concrete-100 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}
