import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Search */}
      <div className="flex items-center flex-1 max-w-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search beams, projects, analyses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] 
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]/50 transition"
          />
        </div>
      </div>

      {/* Right: Utility Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notification Bell */}
        <button
          className="w-8 h-8 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-[#F8FAFC] transition flex items-center justify-center border border-transparent hover:border-[#E2E8F0]"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-[#F8FAFC] transition flex items-center justify-center border border-transparent hover:border-[#E2E8F0]"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

        {/* User session chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="w-5 h-5 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#F97316]">
              {user?.name?.charAt(0).toUpperCase() || 'E'}
            </span>
          </div>
          <span className="text-xs font-medium text-[#0F172A] hidden sm:block">
            {user?.name?.split(' ')[0] || 'Engineer'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" title="Online" />
        </div>

        {/* Primary CTA */}
        <Button
          variant="accent"
          size="sm"
          icon="add"
          onClick={() => navigate('/beam-design')}
        >
          New Beam
        </Button>
      </div>
    </header>
  );
}
