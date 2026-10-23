import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BatteryCharging, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Mood } from '../types';

export const CheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitCheckin, checkin, isGeneratingPlan } = useData();

  const [energy, setEnergy] = useState<number>(checkin?.energy || 8);
  const [mood, setMood] = useState<Mood>(checkin?.mood || 'focused');
  const [mainGoal, setMainGoal] = useState<string>(checkin?.main_goal || '');
  const [obstacles, setObstacles] = useState<string>(checkin?.obstacles || '');
  const [availableMinutes, setAvailableMinutes] = useState<number>(checkin?.available_minutes || 180);
  const [urgentCommitments, setUrgentCommitments] = useState<string>(checkin?.urgent_commitments || '');
  const [error, setError] = useState<string | null>(null);

  const moods: { id: Mood; label: string; icon: string }[] = [
    { id: 'energized', label: 'Energized', icon: '⚡' },
    { id: 'focused', label: 'Focused', icon: '🎯' },
    { id: 'neutral', label: 'Neutral', icon: '⚖️' },
    { id: 'stressed', label: 'Stressed', icon: '🌪️' },
    { id: 'tired', label: 'Tired', icon: '🔋' },
  ];

  const timePills = [
    { label: '30m', value: 30 },
    { label: '1 Hour', value: 60 },
    { label: '2 Hours', value: 120 },
    { label: '3 Hours', value: 180 },
    { label: '4 Hours', value: 240 },
    { label: 'Full Day (6h+)', value: 360 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainGoal.trim()) {
      setError('Please state your primary objective for today.');
      return;
    }

    setError(null);
    try {
      await submitCheckin({
        energy,
        mood,
        main_goal: mainGoal.trim(),
        obstacles: obstacles.trim() || null,
        available_minutes: availableMinutes,
        urgent_commitments: urgentCommitments.trim() || null,
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate plan. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            60-Second Executive Alignment
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Daily CEO Check-in
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Define today's capacity, state, and primary outcome. Your AI chief of staff will formulate a realistic, calibrated execution plan.
        </p>
      </div>

      {error && (
        <div className="p-3.5 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="card-executive rounded-xl p-6 space-y-6">
        {/* 1. Energy Vitality Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-amber-400" />
              <span>Current Energy Level</span>
            </label>
            <span className="font-mono text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {energy} / 10
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setEnergy(num)}
                className={`flex-1 py-2 text-xs rounded-lg font-mono font-medium transition cursor-pointer ${
                  energy === num
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-bold'
                    : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {energy >= 8 ? 'High vitality: optimal for intellectually intense breakthroughs.' : energy >= 5 ? 'Steady capacity: focused execution on structured blocks.' : 'Low capacity: protect energy with a single ultra-lean mission.'}
          </p>
        </div>

        {/* 2. Mood Quick Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Mental State / Mood
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mood === m.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 font-semibold shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Primary Goal */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            What is your single most important goal today? <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            placeholder="e.g. Finalize Q4 architecture proposal and resolve vendor latency blockers"
            className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* 4. Time Budget Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Available Focus Time Today</span>
            </label>
            <span className="font-mono text-xs font-bold text-indigo-300">
              {availableMinutes} minutes ({Math.round((availableMinutes / 60) * 10) / 10}h)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {timePills.map((pill) => (
              <button
                type="button"
                key={pill.value}
                onClick={() => setAvailableMinutes(pill.value)}
                className={`py-1.5 text-xs rounded-lg border font-mono transition cursor-pointer ${
                  availableMinutes === pill.value
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 font-semibold'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={15}
            max={480}
            step={15}
            value={availableMinutes}
            onChange={(e) => setAvailableMinutes(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* 5. Obstacles / Constraints (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Anticipated Obstacles or Constraints (Optional)
          </label>
          <input
            type="text"
            value={obstacles}
            onChange={(e) => setObstacles(e.target.value)}
            placeholder="e.g. Unpredictable slack pings, vendor API rate limits, heavy fatigue after lunch"
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* 6. Urgent Commitments / Deadlines (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Fixed Commitments or Hard Deadlines (Optional)
          </label>
          <input
            type="text"
            value={urgentCommitments}
            onChange={(e) => setUrgentCommitments(e.target.value)}
            placeholder="e.g. 4:00 PM Board status call"
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isGeneratingPlan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition cursor-pointer shadow-lg active:scale-95"
          >
            {isGeneratingPlan ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                <span>Formulating Executive Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Generate CEO Daily Plan</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
