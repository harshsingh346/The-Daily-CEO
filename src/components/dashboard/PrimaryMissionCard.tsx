import React from 'react';
import { Target, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type { PrimaryMission } from '../../types';
import { formatMinutes } from '../../lib/dates';

interface PrimaryMissionCardProps {
  mission: PrimaryMission;
  isAllMovesCompleted: boolean;
  version: number;
}

export const PrimaryMissionCard: React.FC<PrimaryMissionCardProps> = ({
  mission,
  isAllMovesCompleted,
  version,
}) => {
  return (
    <div className="card-executive rounded-xl p-5 sm:p-6 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/[0.04] blur-3xl pointer-events-none rounded-full" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
            Today's Primary Mission
          </span>
        </div>

        <div className="flex items-center gap-2">
          {version > 1 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Revised v{version}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatMinutes(mission.estimatedMinutes)}
          </span>
        </div>
      </div>

      {/* Mission Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-slate-100 tracking-tight mt-3 mb-2 leading-snug">
        {mission.title}
      </h2>

      {/* Why it Matters */}
      <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
        <span className="font-semibold text-indigo-300 text-[11px] block mb-0.5 uppercase tracking-wide">
          Strategic Leverage
        </span>
        {mission.why}
      </div>

      {/* Success Criteria */}
      <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
        <CheckCircle2
          className={`w-4 h-4 mt-0.5 shrink-0 ${
            isAllMovesCompleted ? 'text-emerald-400' : 'text-slate-400'
          }`}
        />
        <div>
          <span className="text-slate-300 font-medium">Verifiable Finish Line: </span>
          <span>{mission.successCriteria}</span>
        </div>
      </div>
    </div>
  );
};
