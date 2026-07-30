import React from 'react';

/**
 * BeamWise AI Vector Logo Component
 * Incorporates Reinforced Concrete I-Beam Section, Steel Rebar, and AI Neural Nodes
 * Colors: Navy Blue (#0F172A), Steel Gray (#475569), Vibrant Orange Accent (#F97316)
 */
export default function BeamWiseLogo({ className = "w-9 h-9", showText = false, textClassName = "text-white" }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Outer Rounded Container */}
          <rect width="100" height="100" rx="22" fill="#0F172A" />
          
          {/* I-Beam Section & Concrete Cross Section */}
          <path d="M 22 24 H 78 V 34 H 58 V 66 H 78 V 76 H 22 V 66 H 42 V 34 H 22 Z" fill="#334155" />
          
          {/* Steel Rebar Dots (Top & Bottom Flanges) */}
          <circle cx="28" cy="29" r="3.5" fill="#F97316" />
          <circle cx="50" cy="29" r="3.5" fill="#F97316" />
          <circle cx="72" cy="29" r="3.5" fill="#F97316" />

          <circle cx="28" cy="71" r="3.5" fill="#F97316" />
          <circle cx="50" cy="71" r="3.5" fill="#F97316" />
          <circle cx="72" cy="71" r="3.5" fill="#F97316" />

          {/* AI Neural Links & Glowing Central Node */}
          <path d="M 28 29 L 50 50 L 72 29" stroke="#F97316" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.8" />
          <path d="M 28 71 L 50 50 L 72 71" stroke="#F97316" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.8" />

          {/* Central AI Core Node */}
          <circle cx="50" cy="50" r="8" fill="#F97316" />
          <circle cx="50" cy="50" r="12" stroke="#FFEDD5" strokeWidth="1.5" opacity="0.9" />
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-heading font-black text-lg tracking-tight leading-none ${textClassName}`}>
            BEAMWISE <span className="text-orange-500">AI</span>
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">
            Precision Structural Platform
          </span>
        </div>
      )}
    </div>
  );
}
