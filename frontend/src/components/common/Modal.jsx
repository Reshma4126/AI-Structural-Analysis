import React, { useEffect } from 'react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon = 'info',
  children,
  primaryActionText = 'Confirm',
  onPrimaryAction,
  secondaryActionText = 'Cancel',
  isPrimaryDanger = false,
  maxWidth = 'max-w-xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-white rounded border border-concrete-300 shadow-2xl w-full ${maxWidth} overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-navy-50 border-b border-concrete-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-steel-100 text-steel-700">
              <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-navy-800">{title}</h3>
              {subtitle && <p className="text-xs text-navy-500">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-navy-400 hover:text-navy-700 hover:bg-concrete-200 transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-concrete-50 border-t border-concrete-200 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {secondaryActionText}
          </Button>
          {onPrimaryAction && (
            <Button
              variant={isPrimaryDanger ? 'danger' : 'primary'}
              onClick={onPrimaryAction}
            >
              {primaryActionText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
