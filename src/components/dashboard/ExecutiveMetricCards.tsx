import React from 'react';
import { Target, Zap, BarChart2, MoreHorizontal } from 'lucide-react';
import { DeepWorkWave, EnergyFocusWave, DecisionMomentumBars } from './GoldenWaves';

interface ExecutiveMetricCardsProps {
  deepWorkMinutes?: number;
  energyPercent?: number;
  decisionScore?: number;
}

export const ExecutiveMetricCards: React.FC<ExecutiveMetricCardsProps> = ({
  deepWorkMinutes = 85,
  energyPercent = 88,
  decisionScore = 64,
}) => {
  const hours = Math.floor(deepWorkMinutes / 60);
  const mins = deepWorkMinutes % 60;
  const deepWorkDisplay = `${hours}h ${mins}m`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Deep Work Card */}
      <div className="card-ceo rounded-2xl p-5 relative overflow-hidden border border-white/[0.08] shadow-xl group">
        <DeepWorkWave />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                <Target className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                  Deep Work
                </h3>
                <p className="text-[11px] text-slate-400">
                  Focused time without distractions
                </p>
              </div>
            </div>

            <button className="text-slate-400 hover:text-slate-200 transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Metric and delta */}
          <div className="mt-6">
            <div className="text-3xl font-bold tracking-tight text-slate-100 font-sans">
              {deepWorkDisplay}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1 font-mono">
              <span>▲</span> +42% vs. yesterday
            </p>
          </div>
        </div>
      </div>

      {/* 2. Energy & Focus Card */}
      <div className="card-ceo rounded-2xl p-5 relative overflow-hidden border border-white/[0.08] shadow-xl group">
        <EnergyFocusWave />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                  Energy & Focus
                </h3>
                <p className="text-[11px] text-slate-400">
                  Your mental & physical energy
                </p>
              </div>
            </div>

            <button className="text-slate-400 hover:text-slate-200 transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6">
            <div className="text-3xl font-bold tracking-tight text-slate-100 font-sans">
              {energyPercent}%
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1 font-mono">
              <span>▲</span> +12% vs. yesterday
            </p>
          </div>
        </div>
      </div>

      {/* 3. Decision Momentum Card */}
      <div className="card-ceo rounded-2xl p-5 relative overflow-hidden border border-white/[0.08] shadow-xl group">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                <BarChart2 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                  Decision Momentum
                </h3>
                <p className="text-[11px] text-slate-400">
                  Quality of decisions & action
                </p>
              </div>
            </div>

            <button className="text-slate-400 hover:text-slate-200 transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold tracking-tight text-slate-100 font-sans">
                {decisionScore}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Current score
              </p>
            </div>

            <DecisionMomentumBars />
          </div>
        </div>
      </div>
    </div>
  );
};
