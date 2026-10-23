import React from 'react';
import { Sparkles, MoreHorizontal, ArrowRight } from 'lucide-react';
import { CeoInsightMountain } from './GoldenWaves';

interface CeoInsightCardProps {
  onViewStrategy: () => void;
  insightTitle?: string;
  insightBody?: string;
}

export const CeoInsightCard: React.FC<CeoInsightCardProps> = ({
  onViewStrategy,
  insightTitle = 'Protect your first focus block.',
  insightBody = 'Move small tasks to the afternoon.',
}) => {
  return (
    <div className="card-ceo rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-bold">
            CEO INSIGHT
          </span>
        </div>

        <button className="text-slate-400 hover:text-slate-200 transition">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Golden Mountain Illustration */}
      <div className="my-2">
        <CeoInsightMountain />
      </div>

      {/* Insight Text */}
      <div className="space-y-1 mb-5">
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight leading-snug">
          {insightTitle}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {insightBody}
        </p>
      </div>

      {/* Action Button matching reference */}
      <button
        onClick={onViewStrategy}
        className="w-full py-2.5 px-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/15 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer group"
      >
        <span>View strategy</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
