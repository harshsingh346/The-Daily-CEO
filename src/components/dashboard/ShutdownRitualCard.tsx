import React, { useState } from 'react';
import { Moon, Check, PowerOff } from 'lucide-react';

interface ShutdownRitualCardProps {
  ritual: string[];
}

export const ShutdownRitualCard: React.FC<ShutdownRitualCardProps> = ({ ritual }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isAllShutDown = ritual.length > 0 && completedCount === ritual.length;

  return (
    <div className="card-executive rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Moon className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-semibold text-slate-200 tracking-tight">
              Shutdown Ritual
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {completedCount}/{ritual.length} steps
          </span>
        </div>

        <div className="space-y-2">
          {ritual.map((step, idx) => {
            const isDone = !!completedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition select-none ${
                  isDone
                    ? 'bg-emerald-500/[0.06] border-emerald-500/20 text-slate-400 line-through'
                    : 'bg-white/[0.02] border-white/[0.04] text-slate-300 hover:border-white/[0.1]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-white/[0.2] bg-white/[0.02]'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="leading-snug">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <PowerOff className={`w-3.5 h-3.5 ${isAllShutDown ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>{isAllShutDown ? 'Workday closed out cleanly.' : 'Complete before evening review.'}</span>
        </span>
      </div>
    </div>
  );
};
