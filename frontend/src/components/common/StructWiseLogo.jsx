import React from 'react';
import logoImg from '../../assets/structwise-logo.png';

/**
 * StructWise AI — Official Brand Logo Component
 * Uses the uploaded brand logo image (I-beam + AI circuit motif)
 * 
 * showText values:
 *   false  → logo image only (logo image includes wordmark)
 *   true   → logo image (which already has wordmark)
 *   'mini' → small icon-only crop suitable for sidebar collapsed state
 */
export default function StructWiseLogo({ className = "h-9 w-auto", showText = false, textClassName = "" }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <img
        src={logoImg}
        alt="StructWise AI"
        className={`object-contain ${className}`}
        draggable={false}
      />
    </div>
  );
}
