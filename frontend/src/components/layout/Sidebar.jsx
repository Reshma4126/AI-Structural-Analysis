import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Flat navigation list matching the sidebar shown in the app
const navItems = [
  { name: 'Dashboard',      path: '/dashboard',      icon: 'dashboard' },
  { name: 'Projects',       path: '/projects',       icon: 'folder_open' },
  { name: 'Beam Input',     path: '/beam-design',    icon: 'architecture' },
  { name: 'Analysis',       path: '/analysis',       icon: 'psychology' },
  { name: 'Comparison',     path: '/comparison',     icon: 'compare_arrows' },
  { name: 'Evaluation',     path: '/evaluation',     icon: 'fact_check' },
  { name: 'Recommendations',path: '/recommendations',icon: 'tips_and_updates' },
  { name: 'XAI / SHAP',    path: '/xai',            icon: 'auto_awesome' },
  { name: 'Reports',        path: '/reports',        icon: 'description' },
  { name: 'History',        path: '/history',        icon: 'history' },
  { name: 'Settings',       path: '/settings',       icon: 'settings' },
];

export default function Sidebar({ collapsed, toggleCollapse }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`bg-[#0F172A] text-white flex flex-col transition-all duration-300 z-30 h-screen sticky top-0 shadow-xl ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* ── Brand Header ── */}
      <div className={`h-16 flex items-center justify-between border-b border-[#1E293B] ${collapsed ? 'px-2' : 'px-4'}`}>
        <div
          className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1"
          onClick={() => navigate('/dashboard')}
          title="StructWise AI"
        >
          {collapsed ? (
            /* Collapsed: small icon */
            <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#F97316] text-lg">architecture</span>
            </div>
          ) : (
            /* Expanded: text wordmark */
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#F97316] text-lg">architecture</span>
              </div>
              <div>
                <p className="font-heading font-black text-sm tracking-tight leading-none text-white">
                  STRUCTWISE <span className="text-[#F97316]">AI</span>
                </p>
                <p className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">
                  Structural Intelligence
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-[#1E293B] transition shrink-0"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="material-symbols-outlined text-base">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* ── Navigation (flat list) ── */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                collapsed ? 'px-2 justify-center' : 'px-3'
              } ${
                isActive
                  ? 'bg-[#1E293B] text-white border-l-4 border-[#F97316] font-bold'
                  : 'text-slate-400 border-l-4 border-transparent hover:bg-[#1E293B]/60 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="font-heading text-[13px] tracking-wide truncate">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className={`border-t border-[#1E293B] bg-[#080E1A] ${collapsed ? 'p-2' : 'p-3'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          {/* Avatar initials */}
          <div className="w-8 h-8 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 flex items-center justify-center font-bold text-[#F97316] text-sm shrink-0 uppercase">
            {user?.name?.charAt(0) || 'E'}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-heading font-bold text-white truncate leading-tight">
                  {user?.name || 'Engineer'}
                </p>
                <p className="text-[10px] font-mono text-[#F97316] truncate leading-tight">
                  {user?.role || 'Structural Engineer'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-rose-400 hover:bg-[#1E293B] transition shrink-0"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
