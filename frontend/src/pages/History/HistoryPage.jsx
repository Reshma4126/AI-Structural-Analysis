import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAnalysis } from '../../context/AnalysisContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { historyList, loadAnalysis, deleteAnalysis } = useAnalysis();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [warningMsg, setWarningMsg] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Toggle selection for comparison
  const handleToggleSelect = (analysisId) => {
    const sId = String(analysisId);
    if (selectedIds.includes(sId)) {
      setSelectedIds(selectedIds.filter((id) => id !== sId));
      setWarningMsg('');
    } else {
      if (selectedIds.length >= 3) {
        setWarningMsg('You can select a maximum of 3 beam analyses for comparison.');
        return;
      }
      setSelectedIds([...selectedIds, sId]);
      setWarningMsg('');
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setWarningMsg('');
  };

  const handleCompareSelected = () => {
    if (selectedIds.length < 2) return;
    navigate('/comparison', { state: { selectedIds } });
  };

  const handleOpenRecord = (analysisId) => {
    loadAnalysis(analysisId);
    navigate('/analysis');
  };

  const handleCompareSingle = (analysisId) => {
    const sId = String(analysisId);
    const candidateB = historyList.find(h => String(h.analysisId) !== sId);
    const candidateBId = candidateB ? String(candidateB.analysisId) : sId;
    navigate('/comparison', { state: { selectedIds: [sId, candidateBId] } });
  };

  const handleOpenReport = (analysisId) => {
    loadAnalysis(analysisId);
    navigate('/reports');
  };

  const handleDelete = (analysisId) => {
    if (window.confirm(`Are you sure you want to delete analysis run #${analysisId}?`)) {
      deleteAnalysis(analysisId);
      setSelectedIds(selectedIds.filter(id => id !== String(analysisId)));
    }
  };

  // Filter & Search Logic
  let filteredList = historyList.filter((item) => {
    const beamName = item.beamName || '';
    const projName = item.projectName || item.project_name || '';
    const query = search.toLowerCase();

    const matchesSearch =
      beamName.toLowerCase().includes(query) ||
      projName.toLowerCase().includes(query) ||
      String(item.analysisId).includes(query);

    const score = item.beam_health_score ?? 85;
    let matchesStatus = true;
    if (statusFilter === 'PASS') matchesStatus = score >= 80;
    if (statusFilter === 'WARNING') matchesStatus = score < 80;

    return matchesSearch && matchesStatus;
  });

  // Sort Order
  filteredList.sort((a, b) => {
    const dateA = new Date(a.createdAt || Date.now());
    const dateB = new Date(b.createdAt || Date.now());
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination slicing
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (score) => {
    if (score >= 85) return <Badge variant="green font-bold">OPTIMAL ({score}%)</Badge>;
    if (score >= 70) return <Badge variant="amber font-bold">ACCEPTABLE ({score}%)</Badge>;
    return <Badge variant="red font-bold">DEFICIENT ({score}%)</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-body">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-concrete-300 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brandOrange font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-brandOrange"></span>
              STRUCTWISE AI AUDIT TRAIL • PERMANENT EXECUTION ARCHIVE
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-brandNavy tracking-tight">
              Structural Analysis History
            </h1>
            <p className="text-xs text-brandSteel mt-0.5">
              Review saved beam calculation runs, compare side-by-side, or download official report sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="accent" icon="play_arrow" onClick={() => navigate('/beam-design')}>
              Create New Beam
            </Button>
          </div>
        </div>

        {/* Selection & Comparison Control Bar */}
        <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-brandBg border border-concrete-300 flex items-center justify-center text-brandNavy font-bold shrink-0">
              <span className="material-symbols-outlined text-xl">compare_arrows</span>
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-brandNavy flex items-center gap-2">
                <span>Side-by-Side Comparison Selector</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brandBg text-brandNavy font-bold border border-concrete-300">
                  {selectedIds.length} / 3 selected
                </span>
              </div>
              <p className="text-xs text-brandSteel font-mono mt-0.5">
                {selectedIds.length < 2 ? (
                  <span className="text-amber-700 font-semibold">Check at least two analyses to compare.</span>
                ) : (
                  <span className="text-emerald-700 font-semibold">Ready to compare {selectedIds.length} beam designs.</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="text-xs font-mono text-brandSteel hover:text-brandNavy underline px-2 py-1"
              >
                Clear Selection
              </button>
            )}
            <Button
              variant="primary"
              icon="compare_arrows"
              disabled={selectedIds.length < 2}
              onClick={handleCompareSelected}
            >
              Compare Selected Beams
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded border border-concrete-300 shadow-blueprint flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-brandSteel text-lg">search</span>
            <input
              type="text"
              placeholder="Search by beam or project name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-brandBg border border-concrete-300 rounded text-xs text-brandNavy font-body"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brandSteel">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-brandBg border border-concrete-300 rounded text-xs px-3 py-1.5 font-mono text-brandNavy"
              >
                <option value="ALL">All Statuses</option>
                <option value="PASS">PASS Only (≥80%)</option>
                <option value="WARNING">WARNING Only (&lt;80%)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brandSteel">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-brandBg border border-concrete-300 rounded text-xs px-3 py-1.5 font-mono text-brandNavy"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
          {currentItems.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-brandBg border border-concrete-300 flex items-center justify-center text-brandNavy mx-auto">
                <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-brandNavy">No analyses stored in history</h3>
                <p className="text-xs text-brandSteel">Run your first beam analysis to generate execution history.</p>
              </div>
              <Button variant="accent" size="sm" icon="play_arrow" onClick={() => navigate('/beam-design')}>
                Create Beam Input
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-brandBg font-heading font-bold text-[11px] text-brandNavy uppercase border-b border-concrete-200">
                  <tr>
                    <th className="p-3.5 text-center w-12">Select</th>
                    <th className="p-3.5">Beam Name</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-center">Health Score</th>
                    <th className="p-3.5">Failure Mode</th>
                    <th className="p-3.5">Pmax (kN)</th>
                    <th className="p-3.5 text-right min-w-[280px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-concrete-200 text-xs font-mono">
                  {currentItems.map((item) => {
                    const isSelected = selectedIds.includes(String(item.analysisId));
                    const dateStr = item.createdAt 
                      ? new Date(item.createdAt).toLocaleDateString()
                      : new Date().toLocaleDateString();

                    return (
                      <tr
                        key={item.analysisId}
                        className={`transition-colors ${
                          isSelected ? 'bg-amber-50/70 font-medium' : 'hover:bg-brandBg'
                        }`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.analysisId)}
                            className="w-4 h-4 rounded text-brandNavy focus:ring-brandNavy border-concrete-400 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-brandNavy">
                          <div className="text-sm font-extrabold">{item.beamName}</div>
                          <div className="text-[10px] text-brandSteel font-normal">ID: #{item.analysisId}</div>
                        </td>
                        <td className="p-3.5 text-brandSteel font-semibold">
                          {dateStr}
                        </td>
                        <td className="p-3.5 text-center font-extrabold text-brandNavy">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-black ${
                            (item.beam_health_score ?? 85) >= 80 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {item.beam_health_score ?? 85}%
                          </span>
                        </td>
                        <td className="p-3.5 text-brandNavy font-semibold">
                          {item.prediction?.failure_mode ?? 'Flexural-bending (ductile)'}
                        </td>
                        <td className="p-3.5 font-black text-brandNavy text-sm">
                          {item.prediction?.pmax ?? '--'} kN
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Button */}
                            <button
                              onClick={() => handleOpenRecord(item.analysisId)}
                              className="px-2.5 py-1 text-brandNavy bg-concrete-100 hover:bg-brandNavy hover:text-white rounded transition font-bold flex items-center gap-1 text-[11px]"
                              title="View Analysis"
                            >
                              <span className="material-symbols-outlined text-xs">visibility</span>
                              View
                            </button>

                            {/* Compare Button */}
                            <button
                              onClick={() => handleCompareSingle(item.analysisId)}
                              className="px-2.5 py-1 text-amber-900 bg-amber-100 hover:bg-amber-500 hover:text-white rounded transition font-bold flex items-center gap-1 text-[11px]"
                              title="Compare Beam"
                            >
                              <span className="material-symbols-outlined text-xs">compare_arrows</span>
                              Compare
                            </button>

                            {/* Download Report Button */}
                            <button
                              onClick={() => handleOpenReport(item.analysisId)}
                              className="px-2.5 py-1 text-slate-800 bg-slate-200 hover:bg-slate-700 hover:text-white rounded transition font-bold flex items-center gap-1 text-[11px]"
                              title="Download Report Sheet"
                            >
                              <span className="material-symbols-outlined text-xs">description</span>
                              Report
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(item.analysisId)}
                              className="p-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition"
                              title="Delete Record"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-3.5 bg-brandBg border-t border-concrete-200 flex items-center justify-between font-mono text-xs">
              <span className="text-brandSteel">
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredList.length)} of {filteredList.length} runs
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded bg-white border border-concrete-300 text-brandNavy hover:bg-concrete-100 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-3 py-1 font-bold text-brandNavy">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded bg-white border border-concrete-300 text-brandNavy hover:bg-concrete-100 disabled:opacity-40"
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
