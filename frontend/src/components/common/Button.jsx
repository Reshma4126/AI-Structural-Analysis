import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-heading font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-steel-500 hover:bg-steel-600 active:bg-steel-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-concrete-200 hover:bg-concrete-300 active:bg-concrete-400 text-navy-800 border border-concrete-300',
    accent: 'bg-cyanAccent-500 hover:bg-cyanAccent-600 active:bg-cyanAccent-700 text-white shadow-glow-cyan',
    outline: 'border border-steel-500 text-steel-600 hover:bg-steel-50 active:bg-steel-100',
    ghost: 'text-navy-700 hover:bg-navy-50 hover:text-navy-900',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[1.25em]">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[1.25em]">{icon}</span>
      )}
    </button>
  );
}
