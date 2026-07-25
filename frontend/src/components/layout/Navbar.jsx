import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-concrete-300 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search projects, beams, or calculations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 bg-concrete-100 border border-concrete-300 rounded text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-steel-700 bg-steel-50 px-3 py-1.5 rounded border border-steel-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{user?.name || 'User Session'}</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon="add"
          onClick={() => navigate('/beam-design')}
        >
          Add Beam Data
        </Button>

        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded text-navy-600 hover:text-navy-900 hover:bg-concrete-100 transition"
          title="System Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>
    </header>
  );
}
