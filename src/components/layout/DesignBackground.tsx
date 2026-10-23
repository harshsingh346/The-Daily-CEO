import React from 'react';

/**
 * Ultra-luxury executive design background matching the reference UI.
 * Features subtle ambient radial glows, golden diagonal light rays,
 * and a refined dark mesh pattern.
 */
export const DesignBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Deep Space Base Gradient */}
      <div className="absolute inset-0 bg-[#08090d]" />

      {/* 2. Top-Left & Top-Center Golden Ambient Radial Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.08)_0%,_rgba(217,119,6,0.02)_40%,_transparent_70%)] blur-3xl" />

      {/* 3. Top-Right Ambient Golden Glow */}
      <div className="absolute top-[5%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.06)_0%,_rgba(180,83,9,0.01)_50%,_transparent_75%)] blur-3xl" />

      {/* 4. Diagonal Golden Light Streak / Ray matching reference image */}
      <div
        className="absolute -top-48 -left-48 w-[160vw] h-[90vh] opacity-35"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.04) 40%, transparent 70%)',
          transform: 'rotate(-25deg)',
        }}
      />
      <div
        className="absolute top-[20%] -right-48 w-[100vw] h-[60vh] opacity-25"
        style={{
          background: 'radial-gradient(ellipse 70% 20% at 50% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 60%)',
          transform: 'rotate(-35deg)',
        }}
      />

      {/* 5. Subtle Executive Micro-Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 6. Soft Vignette around borders */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(8,9,13,0.6)_100%)]" />
    </div>
  );
};
