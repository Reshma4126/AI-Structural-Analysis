import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsList } from '../../services/mockData';
import Button from '../common/Button';

export default function Navbar({ onOpenNewCalc }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notificationsList.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-concrete-300 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Search Bar & Project Badge */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search calculations, beams, AISC codes, or projects... (Ctrl + K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 bg-concrete-100 border border-concrete-300 rounded text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-navy-400 bg-concrete-200 rounded border border-concrete-300">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Notifications, User Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Quick New Calculation Button */}
        <Button
          variant="primary"
          size="sm"
          icon="add"
          onClick={() => navigate('/beam-design')}
        >
          New Calculation
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded text-navy-600 hover:text-navy-900 hover:bg-concrete-100 transition relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyanAccent-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-concrete-300 rounded shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-concrete-200 flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-navy-800 uppercase tracking-wider">
                  Notifications ({unreadCount})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-steel-600 hover:underline"
                >
                  Close
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-concrete-100">
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 text-xs hover:bg-concrete-50 transition ${
                      item.unread ? 'bg-steel-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between font-heading font-semibold text-navy-800">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-mono text-navy-400">{item.time}</span>
                    </div>
                    <p className="text-navy-600 mt-1 text-[11px] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-concrete-200 text-center">
                <button className="text-xs font-semibold text-steel-600 hover:text-steel-800">
                  Clear all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Documentation / Help */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded text-navy-600 hover:text-navy-900 hover:bg-concrete-100 transition"
          title="System Settings & Help"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>
      </div>
    </header>
  );
}
