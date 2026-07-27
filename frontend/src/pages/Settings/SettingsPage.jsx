import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [unitSystem, setUnitSystem] = useState('Metric'); // 'Metric' | 'Imperial'
  const [defaultCode, setDefaultCode] = useState('AISC 360-16 LRFD');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [autoSave, setAutoSave] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded border border-concrete-300 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-600 mb-1">
            SYSTEM PREFERENCES • SYSTEM CONFIGURATION
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-800 tracking-tight">
            Platform & Engineering Settings
          </h1>
          <p className="text-xs text-navy-500 mt-1">
            Configure unit standards, structural design codes, AI inference thresholds, and user license profile.
          </p>
        </div>

        <Button
          variant="primary"
          icon="save"
          onClick={handleSave}
        >
          {savedSuccess ? 'Settings Saved!' : 'Save Preferences'}
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          System preferences updated successfully!
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Preference Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unit System & Structural Codes */}
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-5">
            <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2 border-b border-concrete-200 pb-3">
              <span className="material-symbols-outlined text-steel-600">tune</span>
              Unit Systems & Design Standards
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                  Primary Unit System
                </label>
                <div className="flex gap-2">
                  {['Metric', 'Imperial'].map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => setUnitSystem(sys)}
                      className={`flex-1 py-2 px-3 rounded font-mono text-xs border transition ${
                        unitSystem === sys
                          ? 'bg-steel-500 text-white font-bold border-steel-500 shadow'
                          : 'bg-concrete-50 text-navy-700 border-concrete-300 hover:bg-concrete-100'
                      }`}
                    >
                      {sys} ({sys === 'Metric' ? 'kN, m, mm' : 'kips, ft, in'})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase mb-1">
                  Default Structural Standard
                </label>
                <select
                  value={defaultCode}
                  onChange={(e) => setDefaultCode(e.target.value)}
                  className="w-full px-3 py-2 bg-concrete-50 border border-concrete-300 rounded text-xs text-navy-800 font-mono focus:outline-none focus:ring-2 focus:ring-steel-500"
                >
                  <option value="AISC 360-16 LRFD">AISC 360-16 LRFD (US Structural Steel)</option>
                  <option value="Eurocode 3 (EN 1993)">Eurocode 3 EN 1993 (European Steel Code)</option>
                  <option value="AASHTO LRFD-9">AASHTO LRFD-9 (Bridge Engineering)</option>
                  <option value="ACI 318-19">ACI 318-19 (Reinforced Concrete)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Decision Support Thresholds */}
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-5">
            <h2 className="text-lg font-heading font-bold text-navy-800 flex items-center gap-2 border-b border-concrete-200 pb-3">
              <span className="material-symbols-outlined text-cyanAccent-600">auto_awesome</span>
              AI Model Thresholds & Safety Rules
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-navy-800 mb-1">
                  <span>Minimum AI Model Confidence Filter:</span>
                  <span className="font-bold text-cyanAccent-700">{aiConfidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={aiConfidenceThreshold}
                  onChange={(e) => setAiConfidenceThreshold(parseInt(e.target.value))}
                  className="w-full accent-cyanAccent-500"
                />
                <p className="text-[11px] text-navy-500 mt-1">
                  Only present AI section recommendations with statistical confidence scores above this threshold.
                </p>
              </div>

              <div className="pt-2 border-t border-concrete-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="w-4 h-4 text-steel-600 focus:ring-steel-500 border-concrete-300 rounded"
                  />
                  <div>
                    <span className="text-xs font-heading font-bold text-navy-800">Auto-save Live Calculation Iterations</span>
                    <p className="text-[11px] text-navy-500">Automatically save calculation steps to cloud workspace history.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: License & Profile */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded border border-concrete-300 shadow-blueprint space-y-4">
            <h3 className="font-heading font-bold text-sm text-navy-800 flex items-center gap-2 border-b border-concrete-200 pb-3">
              <span className="material-symbols-outlined text-steel-600">badge</span>
              Engineer Profile & License
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=00A8CC&color=fff'}
                alt={user?.name || 'User'}
                className="w-20 h-20 rounded-full border border-concrete-300 object-cover"
              />
              <div>
                <h4 className="font-heading font-bold text-base text-navy-900">{user?.name || 'Engineer'}</h4>
                <p className="text-xs text-navy-500 font-body">{user?.role || 'User'}</p>
                <Badge variant="green" size="sm" className="mt-1">Standard License</Badge>
              </div>
            </div>

            <div className="pt-3 border-t border-concrete-200 text-xs font-mono space-y-1 text-navy-600">
              <div>Organization: <strong className="text-navy-800">{user?.company || 'Structura AI'}</strong></div>
              <div>License Type: <strong className="text-cyanAccent-700">Enterprise AI License</strong></div>
              <div>Expiration: <strong className="text-navy-800">December 2027</strong></div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
