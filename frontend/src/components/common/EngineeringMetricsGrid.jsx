import React from 'react';

/**
 * EngineeringMetricsGrid Component
 * Displays analytical structural engineering calculation cards for reinforced concrete sections.
 * Safe against null, undefined, {}, [] inputs.
 */
export default function EngineeringMetricsGrid({ engineering }) {
  const metrics = engineering ?? {};

  const effectiveDepth = metrics.effectiveDepth ?? '--';
  const steelArea = metrics.steelArea ?? '--';
  const neutralAxisDepth = metrics.neutralAxisDepth ?? '--';
  const momentCapacity = metrics.momentCapacity ?? '--';
  const shearCapacity = metrics.shearCapacity ?? '--';

  const cards = [
    {
      title: 'Effective Depth (d)',
      value: `${effectiveDepth} mm`,
      subtitle: 'd = h - cover - ds - db/2',
      icon: 'straighten',
      color: 'border-l-4 border-steel-500'
    },
    {
      title: 'Steel Area (Ast)',
      value: `${steelArea} mm²`,
      subtitle: 'Ast = n * π * db² / 4',
      icon: 'grid_guides',
      color: 'border-l-4 border-cyanAccent-500'
    },
    {
      title: 'Neutral Axis (xu)',
      value: `${neutralAxisDepth} mm`,
      subtitle: 'xu = 0.87 * fy * Ast / (0.36 * fc * b)',
      icon: 'line_weight',
      color: 'border-l-4 border-amber-500'
    },
    {
      title: 'Moment Capacity (Mu)',
      value: `${momentCapacity} kN-m`,
      subtitle: 'Mu = 0.87 * fy * Ast * (d - 0.42 xu)',
      icon: 'architecture',
      color: 'border-l-4 border-emerald-500'
    },
    {
      title: 'Shear Capacity (Vu)',
      value: `${shearCapacity} kN`,
      subtitle: 'Vu = Vc + Vs (Concrete + Stirrups)',
      icon: 'hardware',
      color: 'border-l-4 border-navy-500'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading font-bold text-navy-800 uppercase tracking-wider border-l-4 border-steel-500 pl-3">
          Structural Engineering Section Calculations (IS 456 / ACI 318)
        </h3>
        <span className="text-xs font-mono text-navy-500">Deterministic Analytical Checks</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded border border-concrete-300 shadow-blueprint space-y-2 hover:shadow-md transition-shadow ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-navy-500">{card.title}</span>
              <span className="material-symbols-outlined text-navy-400 text-base">{card.icon}</span>
            </div>
            <div className="text-xl font-heading font-black text-navy-900">{card.value}</div>
            <div className="text-[10px] text-navy-500 font-mono truncate">{card.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
