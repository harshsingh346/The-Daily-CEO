import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, PauseCircle, PlayCircle, Trash2, Calendar, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatShortDate } from '../lib/dates';
import type { Goal } from '../types';

export const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoalStatus, deleteGoal } = useData();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addGoal(title.trim(), description.trim() || undefined, targetDate || undefined);
    setTitle('');
    setDescription('');
    setTargetDate('');
    setIsCreating(false);
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const pausedGoals = goals.filter((g) => g.status === 'paused');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Strategic Horizons
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Executive Goals
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Goals set the strategic vector; your daily Primary Mission represents today's highest-impact step toward them.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Creation Modal / Inline Box */}
      {isCreating && (
        <form onSubmit={handleCreate} className="card-executive rounded-xl p-5 border border-indigo-500/30 space-y-4 animate-fade-in shadow-xl">
          <h2 className="text-sm font-semibold text-slate-100">Create Strategic Goal</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Goal Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ship Enterprise Pilot Release to First 5 Design Partners"
              className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Horizon Date (Optional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-200 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Strategic Context / Notes</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key success metrics, team dependencies..."
                className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="space-y-6">
        {/* Active Goals */}
        <div>
          <h2 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider mb-3">
            Active Horizons ({activeGoals.length})
          </h2>
          {activeGoals.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 border border-dashed border-white/[0.08] rounded-xl text-center">
              No active goals right now. Create a clear direction above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="card-executive rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                        {goal.title}
                      </h3>
                      {goal.target_date && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">
                          <Calendar className="w-3 h-3 text-indigo-400" />
                          {formatShortDate(goal.target_date)}
                        </span>
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      In Progress
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateGoalStatus(goal.id, 'completed')}
                        className="p-1 rounded text-slate-400 hover:text-emerald-400 transition"
                        title="Mark Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateGoalStatus(goal.id, 'paused')}
                        className="p-1 rounded text-slate-400 hover:text-amber-400 transition"
                        title="Pause Goal"
                      >
                        <PauseCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed or Paused Goals */}
        {(completedGoals.length > 0 || pausedGoals.length > 0) && (
          <div className="pt-4 border-t border-white/[0.06] space-y-4">
            <h2 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
              Completed & Paused ({completedGoals.length + pausedGoals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...completedGoals, ...pausedGoals].map((goal) => (
                <div key={goal.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] opacity-75 flex items-center justify-between">
                  <div>
                    <h3 className={`text-xs font-medium text-slate-300 ${goal.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                      {goal.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Status: {goal.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {goal.status === 'paused' && (
                      <button
                        onClick={() => updateGoalStatus(goal.id, 'active')}
                        className="p-1 text-slate-400 hover:text-emerald-400"
                        title="Resume"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
