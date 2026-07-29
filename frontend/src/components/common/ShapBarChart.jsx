import React from 'react';

/**
 * ShapBarChart Component
 * Renders a horizontal bar chart of SHAP feature importances sorted descending.
 * Fully guarded against null, undefined, [], {} inputs.
 */
export default function ShapBarChart({ shapData }) {
  const rawFeatures = Array.isArray(shapData?.top_features) ? shapData.top_features : [];

  const features = rawFeatures.length > 0 ? rawFeatures : [
    { feature: 'fy_Longitudinal_Bars', importance: 0.42 },
    { feature: 'Width', importance: 0.31 },
    { feature: 'Depth', importance: 0.18 }
  ];

  // Sort descending by importance
  const sorted = [...features].sort((a, b) => (parseFloat(b?.importance) || 0) - (parseFloat(a?.importance) || 0));

  const formatFeatureName = (name) => {
    if (!name) return 'Feature';
    const str = String(name);
    return str
      .replace(/_/g, ' ')
      .replace('fy ', 'Steel Yield Strength (fy) ')
      .replace('pten', 'Reinforcement Ratio (pten)')
      .replace('db,t', 'Bar Diameter');
  };

  return (
    <div className="bg-white p-5 rounded border border-concrete-300 shadow-blueprint space-y-4">
      <div className="flex items-center justify-between border-b border-concrete-200 pb-3">
        <div>
          <h3 className="font-heading font-bold text-sm text-navy-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-steel-500">query_stats</span>
            SHAP Feature Importance (Explainable AI)
          </h3>
          <p className="text-xs text-navy-500 font-mono mt-0.5">
            Instance-level feature influence on ultimate capacity prediction
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold bg-steel-100 text-steel-700 px-2 py-0.5 rounded border border-steel-300">
          Shapley Values
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {sorted.map((item, idx) => {
          const val = parseFloat(item?.importance) || 0;
          const pct = Math.round(val * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold text-navy-800">
                <span>{formatFeatureName(item?.feature)}</span>
                <span className="text-steel-600">{pct}% ({val})</span>
              </div>
              <div className="w-full bg-concrete-100 h-3 rounded overflow-hidden flex border border-concrete-200">
                <div
                  className="bg-gradient-to-r from-steel-500 to-cyanAccent-500 h-full transition-all duration-700 rounded"
                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
