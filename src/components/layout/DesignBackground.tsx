import HarpCoil from '../originkit/ui/full-frame-abstract';
import type { HarpCoilColorMode } from '../originkit/ui/full-frame-abstract';

export interface DesignBackgroundProps {
  lineColor?: string;
  color2?: string;
  color3?: string;
  colorMode?: HarpCoilColorMode;
  speed?: number;
  lines?: number;
  opacity?: number;
}

/**
 * Ultra-luxury executive design background with Originkit Full Frame Abstract WebGL wave,
 * ambient radial glows, golden diagonal light rays, and refined dark mesh pattern.
 */
export const DesignBackground: React.FC<DesignBackgroundProps> = ({
  lineColor = '#50DCF2',
  color2 = '#8A6CFF',
  color3 = '#F59E0B',
  colorMode = 'gradient',
  speed = 4.5,
  lines = 28,
  opacity = 0.8,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Deep Space Base Background */}
      <div className="absolute inset-0 bg-[#08090d]" />

      {/* 2. Originkit Full Frame Abstract WebGL Waveform */}
      <div className="absolute inset-0 w-full h-full" style={{ opacity }}>
        <HarpCoil
          background="#08090d"
          lineColor={lineColor}
          colorMode={colorMode}
          color2={color2}
          color3={color3}
          speed={speed}
          lines={lines}
          depth={6.5}
          drift={4.5}
          hover={8}
          zoom={100}
        />
      </div>

      {/* 3. Top-Left & Top-Center Golden Ambient Radial Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.06)_0%,_rgba(217,119,6,0.02)_40%,_transparent_70%)] blur-3xl animate-ambient-breathe pointer-events-none" />

      {/* 4. Top-Right Ambient Golden Glow */}
      <div
        className="absolute top-[5%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.04)_0%,_rgba(180,83,9,0.01)_50%,_transparent_75%)] blur-3xl animate-ambient-breathe pointer-events-none"
        style={{ animationDelay: '2s' }}
      />

      {/* 5. Diagonal Golden Light Streak / Ray */}
      <div
        className="absolute -top-48 -left-48 w-[160vw] h-[90vh] opacity-20 animate-ray-drift pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 30% at 50% 20%, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.02) 40%, transparent 70%)',
        }}
      />

      {/* Floating Golden Micro-Motes / Dust particles */}
      <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 rounded-full bg-amber-400/40 blur-[1px] animate-particle-1 pointer-events-none" />
      <div className="absolute top-[60%] right-[30%] w-1 h-1 rounded-full bg-yellow-300/40 blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-amber-500/30 blur-[1.5px] animate-particle-3 pointer-events-none" />

      {/* 6. Soft Vignette around borders for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(8,9,13,0.6)_100%)] pointer-events-none" />
    </div>
  );
};
