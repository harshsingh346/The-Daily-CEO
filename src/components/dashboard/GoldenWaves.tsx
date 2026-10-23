import React from 'react';

/**
 * High-fidelity golden wave SVGs matching the reference image.
 */

export const DeepWorkWave: React.FC = () => (
  <svg
    viewBox="0 0 240 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute right-0 bottom-0 w-44 h-28 pointer-events-none opacity-85"
  >
    <defs>
      <radialGradient id="deepWorkGlow" cx="70%" cy="80%" r="65%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
        <stop offset="45%" stopColor="#d97706" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path
      d="M20 120 C 60 70, 110 30, 240 10 L 240 120 Z"
      fill="url(#deepWorkGlow)"
    />
    <path
      d="M20 120 C 70 65, 120 28, 240 10"
      stroke="url(#curveGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M45 120 C 90 75, 140 42, 240 25"
      stroke="#f59e0b"
      strokeWidth="1"
      strokeOpacity="0.4"
    />
  </svg>
);

export const EnergyFocusWave: React.FC = () => (
  <svg
    viewBox="0 0 240 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute right-0 bottom-0 w-48 h-28 pointer-events-none opacity-85"
  >
    <defs>
      <linearGradient id="energyWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b45309" stopOpacity="0.05" />
        <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.35" />
        <stop offset="70%" stopColor="#fef08a" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {/* Flowing energetic ribbon */}
    <path
      d="M0 100 C 40 105, 70 85, 110 55 C 150 25, 190 40, 240 15 L 240 120 L 0 120 Z"
      fill="url(#energyWaveGrad)"
      opacity="0.6"
    />
    <path
      d="M10 95 C 50 100, 80 80, 120 50 C 160 20, 200 35, 240 10"
      stroke="#fde047"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 105 C 65 110, 95 85, 135 60 C 175 35, 210 50, 240 25"
      stroke="#f59e0b"
      strokeWidth="1.2"
      strokeOpacity="0.6"
    />
  </svg>
);

export const DecisionMomentumBars: React.FC = () => (
  <div className="flex items-end gap-1.5 h-16 relative">
    {/* Peak Tag */}
    <div className="absolute -top-6 right-5 bg-[#1f2430] border border-amber-500/40 text-[9px] font-mono font-semibold text-amber-300 px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
      <span>Peak: 11 AM</span>
    </div>

    {/* Bars */}
    <div className="w-2.5 h-6 rounded-t bg-slate-800/80" />
    <div className="w-2.5 h-9 rounded-t bg-slate-800/80" />
    <div className="w-2.5 h-12 rounded-t bg-slate-700/80" />
    <div className="w-2.5 h-7 rounded-t bg-slate-800/80" />
    {/* Peak bar */}
    <div className="w-3 h-16 rounded-t bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_12px_rgba(245,158,11,0.5)] border-t border-amber-200" />
    <div className="w-2.5 h-11 rounded-t bg-slate-700/80" />
    <div className="w-2.5 h-14 rounded-t bg-gradient-to-t from-amber-700/80 to-amber-500/60" />
    <div className="w-2.5 h-8 rounded-t bg-slate-800/80" />
    <div className="w-2.5 h-9 rounded-t bg-slate-800/80" />
  </div>
);

export const CeoInsightMountain: React.FC = () => (
  <svg
    viewBox="0 0 200 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-20 my-1 pointer-events-none"
  >
    <defs>
      <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
        <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Ridge 1 */}
    <path
      d="M10 80 Q 70 30, 110 50 T 190 20"
      stroke="#f59e0b"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
    {/* Ridge 2 */}
    <path
      d="M30 85 Q 85 40, 130 55 T 200 35"
      stroke="#fbbf24"
      strokeWidth="1.2"
      strokeOpacity="0.5"
      fill="none"
    />
    {/* Soft fill under ridge */}
    <path
      d="M10 80 Q 70 30, 110 50 T 190 20 L 190 90 L 10 90 Z"
      fill="url(#mountainGrad)"
      opacity="0.3"
    />
  </svg>
);
