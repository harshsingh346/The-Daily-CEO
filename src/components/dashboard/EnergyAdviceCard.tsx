import React from 'react';
import { Zap, HeartPulse } from 'lucide-react';

interface EnergyAdviceCardProps {
  advice: string;
  energyLevel?: number;
}

export const EnergyAdviceCard: React.FC<EnergyAdviceCardProps> = ({ advice, energyLevel }) => {
  return (
    <div className="card-executive rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-semibold text-slate-200 tracking-tight">
              Energy Management Protocol
            </h3>
          </div>
          {energyLevel && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {energyLevel}/10 Vitality
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
          {advice}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-slate-400">
        <HeartPulse className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Protect peak mental capacity for your highest priority move.</span>
      </div>
    </div>
  );
};
