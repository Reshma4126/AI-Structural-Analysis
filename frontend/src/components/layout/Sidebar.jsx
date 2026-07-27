import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ collapsed, toggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Projects', path: '/projects', icon: 'folder_open' },
    { name: 'Beam Models', path: '/beam-design', icon: 'architecture' },
    { name: 'Analysis', path: '/analysis', icon: 'psychology' },
    { name: 'Comparison', path: '/comparison', icon: 'compare_arrows' },
    { name: 'Reports', path: '/reports', icon: 'description' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  return (
    <aside
      className={`bg-navy-800 text-white flex flex-col transition-all duration-300 z-30 h-screen sticky top-0 border-r border-navy-700 shadow-xl ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-navy-700">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded bg-steel-500 flex items-center justify-center text-white shrink-0 shadow-sm border border-steel-400">
            <span className="material-symbols-outlined text-2xl font-bold">domain</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight leading-none text-white">
                STRUCTURA <span className="text-cyanAccent-400">AI</span>
              </span>
              <span className="text-[10px] font-mono text-navy-300 uppercase tracking-widest mt-1">
                Precision Decision Platform
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggleCollapse}
          className="p-1 rounded text-navy-300 hover:text-white hover:bg-navy-700 transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <span className="material-symbols-outlined text-lg">
            {collapsed ? 'menu_open' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-steel-500 text-white shadow-md font-semibold'
                  : 'text-navy-200 hover:bg-navy-700 hover:text-white'
              }`
            }
            title={collapsed ? item.name : undefined}
          >
            <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
            {!collapsed && <span className="font-heading tracking-wide truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Card Footer */}
      <div className="p-3 border-t border-navy-700 bg-navy-900/50">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=00A8CC&color=fff'}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full border border-navy-700 object-cover bg-navy-800"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-heading font-bold text-white truncate">{user?.name || 'Engineer'}</p>
              <p className="text-[10px] font-mono text-cyanAccent-300 truncate">{user?.role || 'User'}</p>
            </div>
          )}
          {!collapsed && (
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }} 
              className="w-9 h-9 flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-navy-800 rounded transition-colors"
              title="Sign out"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
