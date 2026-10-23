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

      {/* 2. Top-Left & Top-Center Golden Ambient Radial Glow with breathing animation */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.08)_0%,_rgba(217,119,6,0.02)_40%,_transparent_70%)] blur-3xl animate-ambient-breathe" />

      {/* 3. Top-Right Ambient Golden Glow */}
      <div className="absolute top-[5%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.06)_0%,_rgba(180,83,9,0.01)_50%,_transparent_75%)] blur-3xl animate-ambient-breathe" style={{ animationDelay: '2s' }} />

      {/* 4. Diagonal Golden Light Streak / Ray matching reference image with gentle drift */}
      <div
        className="absolute -top-48 -left-48 w-[160vw] h-[90vh] opacity-35 animate-ray-drift"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 20%, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.04) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[20%] -right-48 w-[100vw] h-[60vh] opacity-25 animate-ray-drift-reverse"
        style={{
          background: 'radial-gradient(ellipse 70% 20% at 50% 50%, rgba(251, 191, 36, 0.13) 0%, transparent 60%)',
        }}
      />

      {/* Floating Golden Micro-Motes / Dust particles matching sunlight in luxury interior */}
      <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 rounded-full bg-amber-400/40 blur-[1px] animate-particle-1" />
      <div className="absolute top-[60%] right-[30%] w-1 h-1 rounded-full bg-yellow-300/40 blur-[1px] animate-particle-2" />
      <div className="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-amber-500/30 blur-[1.5px] animate-particle-3" />

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
