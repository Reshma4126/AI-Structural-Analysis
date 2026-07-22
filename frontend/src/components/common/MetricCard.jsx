import React from 'react';

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  badgeText,
  statusColor = 'steel', // 'steel' | 'cyan' | 'green' | 'amber' | 'red'
  className = '',
}) {
  const statusColors = {
    steel: 'border-steel-500 text-steel-600 bg-steel-50',
    cyan: 'border-cyanAccent-500 text-cyanAccent-600 bg-cyanAccent-50',
    green: 'border-emerald-500 text-emerald-600 bg-emerald-50',
    amber: 'border-amber-500 text-amber-600 bg-amber-50',
    red: 'border-red-500 text-red-600 bg-red-50',
  };

  const iconBg = {
    steel: 'bg-steel-100 text-steel-600',
    cyan: 'bg-cyanAccent-100 text-cyanAccent-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`bg-white p-5 rounded border border-concrete-300 shadow-blueprint transition-all duration-200 hover:border-steel-400 relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider font-heading">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-extrabold font-heading text-navy-800 tracking-tight">{value}</span>
            {unit && <span className="text-xs font-mono font-medium text-navy-500">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={`p-2.5 rounded ${iconBg[statusColor]}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
      </div>

      {(subtitle || trend || badgeText) && (
        <div className="mt-3 pt-3 border-t border-concrete-200 flex items-center justify-between text-xs">
          {subtitle && <span className="text-navy-500">{subtitle}</span>}
          {trend && (
            <span className={`font-mono font-semibold flex items-center gap-0.5 ${
              trendType === 'positive' ? 'text-emerald-600' : trendType === 'negative' ? 'text-red-600' : 'text-navy-500'
            }`}>
              <span className="material-symbols-outlined text-sm">
                {trendType === 'positive' ? 'trending_up' : trendType === 'negative' ? 'trending_down' : 'remove'}
              </span>
              {trend}
            </span>
          )}
          {badgeText && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${statusColors[statusColor]}`}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
