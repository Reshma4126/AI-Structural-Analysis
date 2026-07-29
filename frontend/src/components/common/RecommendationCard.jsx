import React from 'react';

/**
 * RecommendationCard Component
 * Displays actionable engineering recommendations and Explainable AI evidence
 * with contextual icon indicators and SHAP-backed reasons.
 */
export default function RecommendationCard({ recommendation }) {
  if (!recommendation) {
    return (
      <div className="p-5 rounded border border-emerald-300 bg-emerald-50/60 text-emerald-900 shadow-blueprint space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-lg">check_circle</span>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm">Actionable Engineering Advice</h4>
            <p className="text-[11px] font-mono opacity-80">SHAP-Assisted Recommendation Engine</p>
          </div>
        </div>
        <p className="text-xs font-body leading-relaxed font-medium pl-12">
          Beam is structurally adequate with optimal strength and ductility.
        </p>
      </div>
    );
  }

  // Handle payload whether passed as raw string or rich recommendation object
  const recObj = typeof recommendation === 'object' ? recommendation : {};
  const recSummary = typeof recommendation === 'string'
    ? recommendation
    : (recObj.summary || recObj.root_cause || "Beam section parameters are evaluated via Explainable AI.");

  const aiExplanation = recObj.ai_explanation || {};
  const topPos = aiExplanation.top_positive_contributors || [];
  const topNeg = aiExplanation.top_negative_contributors || [];
  const recommendationsList = recObj.recommendations || [];

  let iconName = "check_circle";
  let colorTheme = "border-emerald-300 bg-emerald-50/60 text-emerald-900";
  let iconBg = "bg-emerald-500 text-white";
  let badgeLabel = recObj.status || "Optimal Design";

  if (recSummary.includes("Increase") || recSummary.includes("depth") || recSummary.includes("exceeds") || recObj.status === "Critical" || recObj.status === "Warning") {
    iconName = "warning";
    colorTheme = "border-amber-300 bg-amber-50/70 text-amber-900";
    iconBg = "bg-amber-500 text-white";
    badgeLabel = recObj.status || "Optimization Advised";
  }

  return (
    <div className="space-y-4">
      {/* Primary Recommendation Banner */}
      <div className={`p-5 rounded border shadow-blueprint space-y-3 ${colorTheme}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${iconBg}`}>
              <span className="material-symbols-outlined text-lg">{iconName}</span>
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm">AI-Assisted Structural Decision Support</h4>
              <p className="text-[11px] font-mono opacity-80">
                SHAP-Driven Root Cause & Evidence Engine
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-current opacity-90">
            {badgeLabel}
          </span>
        </div>

        {recObj.primary_issue && (
          <div className="text-xs font-mono font-bold text-navy-800 pl-12">
            PRIMARY ISSUE: <span className="font-extrabold text-rose-700">{recObj.primary_issue}</span>
          </div>
        )}

        <p className="text-xs font-body leading-relaxed font-medium pl-12">
          {recSummary}
        </p>
      </div>

      {/* Explainable AI Positive vs Negative Contributors Grid */}
      {(topPos.length > 0 || topNeg.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50/80 rounded border border-emerald-200 space-y-2">
            <h5 className="font-heading font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-600 font-bold">check_circle</span>
              Top Positive Contributors
            </h5>
            <ul className="space-y-1 text-xs font-mono text-emerald-950">
              {topPos.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded border border-emerald-100">
                  <span>{item.engineering_meaning || `✓ ${item.feature}`}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">{item.impact || '+0.0%'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-rose-50/80 rounded border border-rose-200 space-y-2">
            <h5 className="font-heading font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-rose-600 font-bold">cancel</span>
              Top Negative Contributors
            </h5>
            <ul className="space-y-1 text-xs font-mono text-rose-950">
              {topNeg.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded border border-rose-100">
                  <span>{item.engineering_meaning || `✗ ${item.feature}`}</span>
                  <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded text-[10px]">{item.impact || '-0.0%'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Evidence-Based Recommendations List */}
      {recommendationsList.length > 0 && (
        <div className="bg-white p-4 rounded border border-concrete-300 space-y-3">
          <h5 className="font-heading font-bold text-xs text-navy-800 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-steel-600 text-sm">fact_check</span>
            Evidence-Based Recommendations
          </h5>
          <div className="space-y-2">
            {recommendationsList.map((item, idx) => (
              <div key={idx} className="p-3 bg-concrete-50 rounded border border-concrete-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-900">{item.title || item.recommended}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.priority === 'CRITICAL' || item.priority === 1 ? 'bg-rose-100 text-rose-800' :
                    item.priority === 'HIGH' || item.priority === 2 ? 'bg-amber-100 text-amber-800' : 'bg-cyanAccent-100 text-cyanAccent-800'
                  }`}>
                    {item.priority || 'MEDIUM'}
                  </span>
                </div>
                {item.reason && (
                  <p className="text-navy-700 font-body text-[11px]">
                    <strong className="font-mono text-navy-900">Reason: </strong> {item.reason}
                  </p>
                )}
                {item.expected_benefit && (
                  <p className="text-emerald-800 font-mono text-[11px] font-bold">
                    Benefit: {item.expected_benefit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
