import React from 'react';
import { Check, Clock, CheckCircle2 } from 'lucide-react';
import type { KeyMove } from '../../types';
import { formatMinutes } from '../../lib/dates';

interface KeyMoveCardProps {
  move: KeyMove;
  onToggle: (moveId: string) => void;
}

export const KeyMoveCard: React.FC<KeyMoveCardProps> = ({ move, onToggle }) => {
  const isCompleted = move.status === 'completed';

  const priorityColors = {
    1: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
    2: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
    3: 'border-slate-500/30 text-slate-300 bg-slate-500/10',
  }[move.priority] || 'border-slate-700 text-slate-300 bg-slate-800';

  return (
    <div
      onClick={() => onToggle(move.id)}
      className={`card-interactive rounded-xl p-4 sm:p-5 border cursor-pointer select-none relative transition-all duration-200 ${
        isCompleted
          ? 'bg-[#0f131c]/70 border-white/[0.05] opacity-75'
          : 'card-executive hover:border-indigo-500/30'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Minimalist Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(move.id);
          }}
          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm'
              : 'border-white/[0.2] bg-white/[0.02] hover:border-indigo-400'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${priorityColors}`}>
              Move #{move.priority}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatMinutes(move.estimated_minutes)}
            </span>
            {isCompleted && move.completed_at && (
              <span className="text-[10px] text-emerald-400/90 font-mono ml-auto">
                Done at {new Date(move.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <h3
            className={`text-sm sm:text-base font-medium tracking-tight leading-snug transition ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
            }`}
          >
            {move.title}
          </h3>

          {move.description && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {move.description}
            </p>
          )}

          {move.completionCriteria && (
            <div className="mt-2 text-[11px] text-slate-400/90 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 shrink-0" />
              <span>Criteria: {move.completionCriteria}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
