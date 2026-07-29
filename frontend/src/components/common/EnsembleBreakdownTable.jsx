import React, { useState } from 'react';

/**
 * EnsembleBreakdownTable Component
 * Expandable component displaying predictions from individual constituent models
 * (Random Forest, Extra Trees, LightGBM, CatBoost) and the final Adaptive Hybrid Ensemble Model (AHEM).
 * Safe against null, undefined, {}, [] inputs.
 */
export default function EnsembleBreakdownTable({ pmaxBreakdown, deltaBreakdown, finalPmax, finalDelta }) {
  const [expanded, setExpanded] = useState(false);

  const pmaxModels = pmaxBreakdown ?? {};
  const deltaModels = deltaBreakdown ?? {};

  const modelNames = ['Random Forest', 'Extra Trees', 'LightGBM', 'CatBoost'];

  return (
    <div className="bg-white rounded border border-concrete-300 shadow-blueprint overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 bg-navy-50 hover:bg-navy-100 flex items-center justify-between transition-colors border-b border-concrete-200 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-steel-600">account_tree</span>
          <div>
            <h4 className="font-heading font-bold text-sm text-navy-900">
              View AI Model Breakdown (Adaptive Hybrid Ensemble - AHEM)
            </h4>
            <p className="text-xs text-navy-500 font-mono">
              Constituent predictions from Random Forest, Extra Trees, LightGBM, CatBoost & Adaptive Weighting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-steel-700">
          <span>{expanded ? 'Hide Breakdown' : 'Expand Breakdown'}</span>
          <span className="material-symbols-outlined transform transition-transform duration-200">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-concrete-100 text-navy-700 font-bold uppercase border-b border-concrete-300">
                <tr>
                  <th className="p-3">Model Architecture</th>
                  <th className="p-3">Predicted Pmax (kN)</th>
                  <th className="p-3">Predicted Δult (mm)</th>
                  <th className="p-3">Ensemble Weight</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {modelNames.map((name, idx) => (
                  <tr key={idx} className="hover:bg-concrete-50">
                    <td className="p-3 font-bold text-navy-900">{name}</td>
                    <td className="p-3 font-bold text-steel-700">
                      {pmaxModels[name] != null ? `${pmaxModels[name]} kN` : '--'}
                    </td>
                    <td className="p-3 font-bold text-steel-700">
                      {deltaModels[name] != null ? `${deltaModels[name]} mm` : '--'}
                    </td>
                    <td className="p-3 text-navy-500">~ 25.0%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Final Weighted AHEM Row */}
                <tr className="bg-steel-50 font-bold text-navy-900 border-t-2 border-steel-400">
                  <td className="p-3 font-heading font-extrabold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-steel-600"></span>
                    Adaptive Hybrid Ensemble (AHEM)
                  </td>
                  <td className="p-3 text-sm font-black text-navy-900">{finalPmax ?? '--'} kN</td>
                  <td className="p-3 text-sm font-black text-navy-900">{finalDelta ?? '--'} mm</td>
                  <td className="p-3 text-emerald-700 font-bold">100.0% Weighted Sum</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-steel-600 text-white shadow-sm">
                      FINAL PREDICTION
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
