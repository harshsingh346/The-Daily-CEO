import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Sparkles,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  HelpCircle,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mail,
  Bell,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ExecutiveMetricCards } from '../components/dashboard/ExecutiveMetricCards';
import { CommandCenterTimeline } from '../components/dashboard/CommandCenterTimeline';
import { CeoInsightCard } from '../components/dashboard/CeoInsightCard';
import { PrimaryMissionCard } from '../components/dashboard/PrimaryMissionCard';
import { DecisionFilterCard } from '../components/dashboard/DecisionFilterCard';
import { EnergyAdviceCard } from '../components/dashboard/EnergyAdviceCard';
import { ShutdownRitualCard } from '../components/dashboard/ShutdownRitualCard';
import { ReplanModal } from '../components/dashboard/ReplanModal';
import { AddWidgetModal } from '../components/dashboard/AddWidgetModal';
import { GmailReminderModal } from '../components/dashboard/GmailReminderModal';
import { StrategyModal, REAL_EXECUTIVE_STRATEGIES } from '../components/dashboard/StrategyModal';
import { HowToUseSection } from '../components/common/HowToUseSection';
import { formatFriendlyDate } from '../lib/dates';
import { analyzePendingTasks } from '../lib/reminderService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { activePlan, checkin, toggleKeyMove, deleteKeyMove, isLoading } = useData();

  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isReplanOpen, setIsReplanOpen] = useState(false);
  const [isGmailReminderOpen, setIsGmailReminderOpen] = useState(false);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(true);
  const [showFullStrategy, setShowFullStrategy] = useState(false);

  const [insightTitle, setInsightTitle] = useState('Protect your first focus block.');
  const [insightBody, setInsightBody] = useState('Move meetings and small tasks strictly to the afternoon.');

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto py-6">
        <div className="h-20 bg-white/[0.03] rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-white/[0.03] rounded-2xl" />
          <div className="h-40 bg-white/[0.03] rounded-2xl" />
          <div className="h-40 bg-white/[0.03] rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white/[0.03] rounded-2xl" />
          <div className="h-72 bg-white/[0.03] rounded-2xl" />
        </div>
      </div>
    );
  }

  const keyMoves = activePlan?.key_moves || [];
  const completedMoves = keyMoves.filter((m) => m.status === 'completed');
  const totalMoves = keyMoves.length || 3;
  const completedCount = completedMoves.length;
  const progressPercent = Math.round((completedCount / totalMoves) * 100);

  // Formatted date matching image "SAT, OCT 24"
  const today = new Date();
  const dateFormatted = today
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase();

  const energyScore = checkin ? checkin.energy * 10 : 88;
  const taskAnalysis = analyzePendingTasks(keyMoves, profile);

  const userDisplayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Executive';

  return (
    <div className="max-w-7xl mx-auto space-y-7 py-2">
      {/* 1. Daily Briefing Sub-header matching reference image */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        {/* Left: Titles */}
        <div>
          <div className="text-[11px] font-mono tracking-widest uppercase text-slate-400 font-semibold mb-1">
            YOUR DAILY BRIEFING
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Lead Your Day with</span>
            <span className="text-gold-gradient animate-gold-shimmer font-extrabold">Intention</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-amber-400">✦</span>
            <span>
              Good morning, <strong className="text-slate-200 capitalize font-medium">{userDisplayName}</strong>. Let's turn your priorities into progress.
            </span>
          </p>
        </div>

        {/* Right: Date pill, priorities progress pill, and action buttons matching reference */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date pill */}
          <div className="h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2 text-xs font-mono font-semibold text-slate-200 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span>{dateFormatted}</span>
          </div>

          {/* Priorities Complete Pill with Golden Bar matching reference */}
          <div className="h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col justify-center gap-1 shadow-sm min-w-[170px]">
            <div className="text-[10px] font-medium text-slate-300">
              {completedCount} of {totalMoves} priorities complete
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full animate-bar-shine rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Add widget button (opens AddWidgetModal) */}
          <button
            onClick={() => setIsAddWidgetOpen(true)}
            className="h-10 px-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 hover:border-amber-400 text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3] text-amber-400" />
            <span>Add widget</span>
          </button>

          {/* Replan button */}
          <button
            onClick={() => setIsReplanOpen(true)}
            className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Recalibrate day plan"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Replan</span>
          </button>

          {/* Customize / How to Use toggle matching reference */}
          <button
            onClick={() => setShowHowToUse(!showHowToUse)}
            className={`h-10 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              showHowToUse
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>How to use</span>
          </button>
        </div>
      </div>

      {/* 2. Three Metric Cards: Deep Work, Energy & Focus, Decision Momentum matching reference */}
      <ExecutiveMetricCards
        deepWorkMinutes={activePlan?.primary_mission.estimatedMinutes || 85}
        energyPercent={energyScore}
        decisionScore={64}
      />

      {/* At-Risk / Missed Priorities Executive Alert Banner */}
      {(taskAnalysis.missedTasks.length > 0 || taskAnalysis.isOverCapacity) && (
        <div className="card-ceo p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#141824] to-rose-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">
                  Priority Execution Alert
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold">
                  {taskAnalysis.missedTasks.length > 0 ? `${taskAnalysis.missedTasks.length} Missed` : 'Time Constrained'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {taskAnalysis.isOverCapacity
                  ? `You have ${taskAnalysis.totalPendingMinutes}m of work left, but only ${taskAnalysis.remainingMinutesInWorkday}m remain in your scheduled workday.`
                  : 'You have missed or unfinished focus blocks on your timeline.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setIsGmailReminderOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Send Gmail Reminder</span>
            </button>
            <button
              onClick={() => setIsReplanOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Replan Day
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Grid: Command Center + CEO Insight matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Command Center */}
        <div className="lg:col-span-2">
          <CommandCenterTimeline
            keyMoves={keyMoves}
            onToggleMove={toggleKeyMove}
            onOpenReplan={() => setIsReplanOpen(true)}
            onOpenAddWidget={() => setIsAddWidgetOpen(true)}
            onOpenGmailReminder={() => setIsGmailReminderOpen(true)}
            onDeleteMove={deleteKeyMove}
          />
        </div>

        {/* Right Column (1 Col): CEO Insight */}
        <div>
          <CeoInsightCard
            onViewStrategy={() => {
              setIsStrategyModalOpen(true);
              setShowFullStrategy(true);
            }}
            insightTitle={insightTitle}
            insightBody={insightBody}
          />
        </div>
      </div>

      {/* 4. Full Strategic Blueprint Section (Toggled via "View strategy") */}
      {showFullStrategy && (
        <div id="strategic-architecture-section" className="space-y-6 pt-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Target className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  Detailed Strategic Architecture
                </h2>
                <button
                  onClick={() => setIsStrategyModalOpen(true)}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline font-normal cursor-pointer"
                >
                  (Browse Real CEO Strategies &rarr;)
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowFullStrategy(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Hide breakdown
            </button>
          </div>

          <PrimaryMissionCard
            mission={activePlan?.primary_mission || REAL_EXECUTIVE_STRATEGIES[0].primaryMission}
            isAllMovesCompleted={completedCount === keyMoves.length && keyMoves.length > 0}
            version={activePlan?.version || 1}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DecisionFilterCard filter={activePlan?.decision_filter || REAL_EXECUTIVE_STRATEGIES[0].decisionFilter} />
            <EnergyAdviceCard
              advice={activePlan?.energy_advice || REAL_EXECUTIVE_STRATEGIES[0].energyAdvice}
              energyLevel={checkin?.energy || 8}
            />
            <ShutdownRitualCard
              ritual={
                activePlan?.shutdown_ritual || [
                  'Review completed focus blocks and record notes',
                  'Lock in tomorrow’s #1 priority',
                  'Disconnect cleanly to protect executive clarity',
                ]
              }
            />
          </div>
        </div>
      )}

      {/* 5. How to Use Section (Clean, simple, user-requested feature) */}
      {showHowToUse && (
        <div className="pt-2 animate-fade-in">
          <HowToUseSection onClose={() => setShowHowToUse(false)} />
        </div>
      )}

      {/* Executive Strategy Suite Modal */}
      <StrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        onStrategyAdopted={(t, b) => {
          setInsightTitle(t);
          setInsightBody(b);
        }}
      />

      {/* Add Widget Modal */}
      <AddWidgetModal isOpen={isAddWidgetOpen} onClose={() => setIsAddWidgetOpen(false)} />

      {/* Replan Modal */}
      <ReplanModal isOpen={isReplanOpen} onClose={() => setIsReplanOpen(false)} />

      {/* Gmail Executive Reminder Modal */}
      <GmailReminderModal
        isOpen={isGmailReminderOpen}
        onClose={() => setIsGmailReminderOpen(false)}
        onOpenReplan={() => setIsReplanOpen(true)}
      />
    </div>
  );
};
