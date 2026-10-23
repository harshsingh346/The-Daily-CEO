import React from 'react';
import { Filter, ArrowRight, Ban } from 'lucide-react';
import type { DecisionFilter } from '../../types';

interface DecisionFilterCardProps {
  filter: DecisionFilter;
}

export const DecisionFilterCard: React.FC<DecisionFilterCardProps> = ({ filter }) => {
  return (
    <div className="card-executive rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Filter className="w-4 h-4" />
          </span>
          <h3 className="text-xs font-semibold text-slate-200 tracking-tight">
            Decision Filter (If / Then)
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] font-mono uppercase font-semibold text-amber-400 block mb-0.5">
              IF Context Shift Occurs
            </span>
            <p className="text-slate-300">{filter.if}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-600/[0.08] border border-indigo-500/20">
            <span className="text-[10px] font-mono uppercase font-semibold text-indigo-300 block mb-0.5">
              THEN Strategic Response
            </span>
            <p className="text-indigo-100">{filter.then}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-start gap-2 text-[11px] text-slate-400">
        <Ban className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-slate-300 font-medium">Categorically Defer: </span>
          <span>{filter.ignoreOrDefer}</span>
        </div>
      </div>
    </div>
  );
};
