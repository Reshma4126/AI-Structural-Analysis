import React from 'react';

/**
 * HealthGauge Component
 * Renders a circular radial gauge for the Beam Health Score with dynamic color schemes.
 * Safe against score = 0, 50, 80, 100, null, undefined, and supports max prop with default MAX_SCORE = 100.
 */
const MAX_SCORE = 100;

export default function HealthGauge({
  score = 85,
  value,
  max = MAX_SCORE,
  ult = null,
  pmax = null,
  status = 'PASS',
  title = 'Beam Health Score',
  radius = 52,
  strokeWidth = 10
}) {
  // Support both `score` and `value` props
  const rawScore = value !== undefined ? value : score;
  const parsed = parseFloat(rawScore);
  
  let numericScore = isNaN(parsed) ? 0 : parsed;
  if (numericScore < 0) numericScore = 0;
  if (numericScore > max) numericScore = max;

  const percentage = max > 0 ? (numericScore / max) * 100 : 0;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let bgTrack = 'text-emerald-100';
  let badgeClass = 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
  let assessmentText = 'Optimal Structural Integrity';

  if (percentage < 70 || status === 'FAIL' || status === 'CRITICAL') {
    colorClass = 'text-rose-500';
    bgTrack = 'text-rose-100';
    badgeClass = 'bg-rose-500/10 text-rose-700 border-rose-300';
    assessmentText = 'Section Redesign Required';
  } else if (percentage < 85 || status === 'WARNING') {
    colorClass = 'text-amber-500';
    bgTrack = 'text-amber-100';
    badgeClass = 'bg-amber-500/10 text-amber-700 border-amber-300';
    assessmentText = 'Acceptable (Section Tuning Recommended)';
  }

  const ultDisplay = ult != null ? `${parseFloat(ult).toFixed(1)} mm` : null;
  const pmaxDisplay = pmax != null ? `${parseFloat(pmax).toFixed(1)} kN` : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-concrete-300 rounded shadow-blueprint">
      <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${bgTrack} stroke-current`}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-heading font-black text-navy-900 leading-none">
            {Math.round(percentage)}%
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-navy-500 mt-1">
            Health Score
          </span>
        </div>
      </div>

      <div className="space-y-3 text-center sm:text-left flex-1">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-mono uppercase font-bold text-navy-500">{title}</span>
          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${badgeClass}`}>
            {status}
          </span>
        </div>
        <h3 className="text-lg font-heading font-bold text-navy-900">
          {assessmentText}
        </h3>
        <p className="text-xs text-navy-600 leading-relaxed font-body">
          Evaluation based on Adaptive Hybrid Ensemble predictions (Pmax{pmaxDisplay ? `: ${pmaxDisplay}` : ''}, Δult{ultDisplay ? `: ${ultDisplay}` : ''}), serviceability limit check (L/250), and failure mode ductility factor.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-concrete-200 h-2 rounded-full overflow-hidden flex">
          <div className={`${colorClass.replace('text-', 'bg-')} h-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}
