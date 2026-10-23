import React, { useState } from 'react';
import { History, Calendar, CheckCircle2, ChevronRight, BookOpen, Moon, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatFriendlyDate, formatMinutes } from '../lib/dates';
import type { DailyPlan } from '../types';

export const HistoryPage: React.FC = () => {
  const { planHistory, reviews, journalEntries } = useData();
  const [selectedPlan, setSelectedPlan] = useState<DailyPlan | null>(null);

  // Group plans by local date
  const dateMap = new Map<string, DailyPlan[]>();
  planHistory.forEach((plan) => {
    const list = dateMap.get(plan.local_date) || [];
    list.push(plan);
    dateMap.set(plan.local_date, list);
  });

  const uniqueDates = Array.from(dateMap.keys()).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <History className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Execution Log
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Daily Strategy History
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review saved daily missions, plan versions, execution rates, and submitted debriefs.
        </p>
      </div>

      {uniqueDates.length === 0 ? (
        <div className="text-center py-12 border border-white/[0.06] rounded-xl bg-white/[0.01]">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No past days recorded yet</p>
          <p className="text-xs text-slate-400 mt-1">Complete your first daily check-in to start your history track record.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {uniqueDates.map((dateStr) => {
            const dayPlans = dateMap.get(dateStr) || [];
            const activeOrLatestPlan = dayPlans.find((p) => p.status === 'active') || dayPlans[0];
            const keyMoves = activeOrLatestPlan?.key_moves || [];
            const completedCount = keyMoves.filter((m) => m.status === 'completed').length;
            const reviewForDay = reviews.find((r) => r.local_date === dateStr);
            const journalsForDay = journalEntries.filter((j) => j.local_date === dateStr);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedPlan(activeOrLatestPlan)}
                className="card-executive rounded-xl p-5 border border-white/[0.08] hover:border-indigo-500/30 transition cursor-pointer space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {formatFriendlyDate(dateStr)}
                    </span>
                    {dayPlans.length > 1 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {dayPlans.length} plan versions
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {completedCount}/{keyMoves.length} Moves
                    </span>
                    {reviewForDay && (
                      <span className="flex items-center gap-1 text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        <Moon className="w-3 h-3 text-indigo-400" />
                        Reviewed
                      </span>
                    )}
                    {journalsForDay.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-300 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        {journalsForDay.length} Notes
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">
                      {activeOrLatestPlan?.primary_mission.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {activeOrLatestPlan?.primary_mission.why}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day Detail Inspection Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11141e] border border-white/[0.1] rounded-xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">
                  Historical Record • v{selectedPlan.version}
                </span>
                <h2 className="text-sm font-semibold text-slate-100">
                  {formatFriendlyDate(selectedPlan.local_date)}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-100 rounded-md hover:bg-white/[0.05]"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Mission */}
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono uppercase font-semibold text-indigo-300 block">
                  Primary Mission
                </span>
                <p className="font-semibold text-slate-100">{selectedPlan.primary_mission.title}</p>
                <p className="text-slate-400">{selectedPlan.primary_mission.why}</p>
              </div>

              {/* Moves */}
              <div>
                <span className="text-[10px] font-mono uppercase font-semibold text-slate-400 block mb-2">
                  Key Moves Record
                </span>
                <div className="space-y-2">
                  {(selectedPlan.key_moves || []).map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/[0.05] border-emerald-500/20 text-slate-300'
                          : 'bg-white/[0.02] border-white/[0.04] text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${m.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'}`}
                        />
                        <span>Move #{m.priority}: {m.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{formatMinutes(m.estimated_minutes)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision filter */}
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase font-semibold text-indigo-300 block">
                  Decision Filter Applied
                </span>
                <p className="text-slate-300"><strong className="text-slate-200">If:</strong> {selectedPlan.decision_filter.if}</p>
                <p className="text-slate-300"><strong className="text-slate-200">Then:</strong> {selectedPlan.decision_filter.then}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
