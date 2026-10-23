import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Check, Sparkles, AlertCircle, ArrowRight, Heart } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatFriendlyDate } from '../lib/dates';
import confetti from 'canvas-confetti';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { todayDate, reviews, submitEveningReview, activePlan } = useData();

  const existingReview = reviews.find((r) => r.local_date === todayDate);

  const [wins, setWins] = useState(existingReview?.wins || '');
  const [obstacles, setObstacles] = useState(existingReview?.obstacles || '');
  const [lesson, setLesson] = useState(existingReview?.lesson || '');
  const [tomorrowFirstAction, setTomorrowFirstAction] = useState(existingReview?.tomorrow_first_action || '');
  const [moodEnd, setMoodEnd] = useState(existingReview?.mood_end || 'energized');
  const [isSaved, setIsSaved] = useState(false);

  const completedMoves = (activePlan?.key_moves || []).filter((m) => m.status === 'completed').length;
  const totalMoves = activePlan?.key_moves?.length || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEveningReview({
      wins: wins.trim() || null,
      obstacles: obstacles.trim() || null,
      lesson: lesson.trim() || null,
      tomorrow_first_action: tomorrowFirstAction.trim() || null,
      mood_end: moodEnd,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#38bdf8', '#10b981'],
    });

    setIsSaved(true);
    setTimeout(() => {
      navigate('/history');
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Moon className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Day Shutdown & Debrief
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Executive Evening Review
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatFriendlyDate(todayDate)} • Close out today's cycle and queue tomorrow's opening move.
        </p>
      </div>

      {/* Today's summary badge */}
      {activePlan && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Today's Mission: </span>
            <span className="text-slate-200 font-semibold">{activePlan.primary_mission.title}</span>
          </div>
          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {completedMoves}/{totalMoves} Moves Done
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-executive rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            What went well today? (Wins & breakthroughs)
          </label>
          <textarea
            rows={2}
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            placeholder="e.g. Cleared key move #1 in 50 minutes without interruptions. High cognitive flow."
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            What got in the way or interrupted focus?
          </label>
          <textarea
            rows={2}
            value={obstacles}
            onChange={(e) => setObstacles(e.target.value)}
            placeholder="e.g. Unscheduled 30m vendor ping; had to replan remaining evening."
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            What did you learn today? (Strategic compounding rule)
          </label>
          <input
            type="text"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="e.g. Batching communication after 4 PM protects 90% of strategic capacity."
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            What is tomorrow morning's single opening move?
          </label>
          <input
            type="text"
            value={tomorrowFirstAction}
            onChange={(e) => setTomorrowFirstAction(e.target.value)}
            placeholder="e.g. Draft staging deployment checklist before checking email or Slack."
            className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Closing Evening Mood
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {['energized', 'satisfied', 'neutral', 'fatigued', 'restless'].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMoodEnd(m)}
                className={`py-1.5 text-xs rounded-lg border capitalize font-medium transition cursor-pointer ${
                  moodEnd === m
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-semibold'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Skip for now
          </button>

          <button
            type="submit"
            disabled={isSaved}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Review Saved!</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-200" />
                <span>Lock In Evening Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
