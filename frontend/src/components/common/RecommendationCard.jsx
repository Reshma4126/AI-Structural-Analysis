import React from 'react';

/**
 * RecommendationCard Component
 * Displays actionable engineering recommendations inside a highlighted panel
 * with contextual icon indicators:
 * ⬆️ Increase depth -> arrow_upward
 * ✅ Structurally adequate -> check_circle
 * ⚠️ Shear / High risk -> warning
 */
export default function RecommendationCard({ recommendation }) {
  const recText = typeof recommendation === 'string'
    ? recommendation
    : (recommendation ? String(recommendation) : "Beam is structurally adequate with optimal strength and ductility.");

  let iconName = "check_circle";
  let colorTheme = "border-emerald-300 bg-emerald-50/60 text-emerald-900";
  let iconBg = "bg-emerald-500 text-white";
  let badgeLabel = "Optimal Design";

  if (recText.includes("Increase") || recText.includes("depth") || recText.includes("exceeds")) {
    iconName = "arrow_upward";
    colorTheme = "border-amber-300 bg-amber-50/70 text-amber-900";
    iconBg = "bg-amber-500 text-white";
    badgeLabel = "Section Tuning Advised";
  } else if (recText.includes("Shear") || recText.includes("risk") || recText.includes("redesign")) {
    iconName = "warning";
    colorTheme = "border-rose-300 bg-rose-50/70 text-rose-900";
    iconBg = "bg-rose-500 text-white";
    badgeLabel = "High Structural Penalty";
  }

  return (
    <div className={`p-5 rounded border shadow-blueprint space-y-3 ${colorTheme}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${iconBg}`}>
            <span className="material-symbols-outlined text-lg">{iconName}</span>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm">Actionable Engineering Advice</h4>
            <p className="text-[11px] font-mono opacity-80">
              Module 6 Rule-Based Recommendation Engine
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-current opacity-90">
          {badgeLabel}
        </span>
      </div>

      <p className="text-xs font-body leading-relaxed font-medium pl-12">
        {recText}
      </p>
    </div>
  );
}
