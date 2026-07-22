import React from 'react';

export default function Badge({
  children,
  variant = 'steel', // 'steel' | 'cyan' | 'green' | 'amber' | 'red' | 'navy'
  size = 'md', // 'sm' | 'md'
  icon,
  className = '',
}) {
  const variantStyles = {
    steel: 'bg-steel-50 text-steel-700 border-steel-300',
    cyan: 'bg-cyanAccent-50 text-cyanAccent-800 border-cyanAccent-300',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    amber: 'bg-amber-50 text-amber-700 border-amber-300',
    red: 'bg-red-50 text-red-700 border-red-300',
    navy: 'bg-navy-100 text-navy-800 border-navy-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={`inline-flex items-center font-mono font-medium rounded border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="material-symbols-outlined text-[1.1em]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
