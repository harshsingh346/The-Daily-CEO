import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle, Clock, Zap } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ReplanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReplanModal: React.FC<ReplanModalProps> = ({ isOpen, onClose }) => {
  const { activePlan, executeReplan } = useData();
  const [changeReason, setChangeReason] = useState('');
  const [remainingMinutes, setRemainingMinutes] = useState(60);
  const [newEnergy, setNewEnergy] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !activePlan) return null;

  const completedMoves = (activePlan.key_moves || []).filter((m) => m.status === 'completed');
  const pendingMoves = (activePlan.key_moves || []).filter((m) => m.status !== 'completed');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReason.trim()) {
      setError('Please specify what changed or caused the shift in plans.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await executeReplan(changeReason.trim(), remainingMinutes, newEnergy);
      onClose();
      setChangeReason('');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate revised plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#11141e] border border-white/[0.1] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Replan Remaining Day</h2>
              <p className="text-[11px] text-slate-400">Preserves your completed work and recalibrates remaining time.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preserved moves notice */}
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="font-medium text-emerald-300">Preserved Progress: </span>
            <span className="text-emerald-200">
              {completedMoves.length} completed move(s) will be locked in history.
            </span>
            {pendingMoves.length > 0 && (
              <span className="block text-[11px] text-emerald-400/80 mt-1">
                {pendingMoves.length} pending move(s) will be restructured to fit your new time limit.
              </span>
            )}
          </div>

          {/* What changed? */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              What changed or interrupted your day? <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="e.g. Urgent customer fire drill took 90 minutes; need to compress the evening."
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Time Remaining */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>How much focused time remains today?</span>
              </label>
              <span className="font-mono text-xs font-semibold text-indigo-300">{remainingMinutes} mins</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 60, 120].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setRemainingMinutes(mins)}
                  className={`py-1.5 text-xs rounded-md border font-mono transition ${
                    remainingMinutes === mins
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-semibold'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={5}
              value={remainingMinutes}
              onChange={(e) => setRemainingMinutes(Number(e.target.value))}
              className="w-full mt-3 accent-indigo-500"
            />
          </div>

          {/* New Energy (Optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Energy Level (Optional)</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setNewEnergy(val)}
                  className={`flex-1 py-1 text-[11px] rounded font-mono transition ${
                    newEnergy === val
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating Strategy...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Replan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
