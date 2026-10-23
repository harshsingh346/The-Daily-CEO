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
import { HowToUseSection } from '../components/common/HowToUseSection';
import { formatFriendlyDate } from '../lib/dates';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { activePlan, checkin, toggleKeyMove, isLoading } = useData();

  const [isReplanOpen, setIsReplanOpen] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(true);
  const [showFullStrategy, setShowFullStrategy] = useState(false);

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
            <span>Good morning. Let's turn your priorities into progress.</span>
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

          {/* Add widget / Replan button matching reference */}
          <button
            onClick={() => setIsReplanOpen(true)}
            className="h-10 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/30 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add widget</span>
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

      {/* 3. Main Dashboard Grid: Command Center + CEO Insight matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Command Center */}
        <div className="lg:col-span-2">
          <CommandCenterTimeline
            keyMoves={keyMoves}
            onToggleMove={toggleKeyMove}
            onOpenReplan={() => setIsReplanOpen(true)}
          />
        </div>

        {/* Right Column (1 Col): CEO Insight */}
        <div>
          <CeoInsightCard
            onViewStrategy={() => setShowFullStrategy(!showFullStrategy)}
            insightTitle="Protect your first focus block."
            insightBody="Move small tasks to the afternoon."
          />
        </div>
      </div>

      {/* 4. Full Strategic Blueprint Section (Toggled via "View strategy") */}
      {showFullStrategy && activePlan && (
        <div className="space-y-6 pt-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-100">
                Detailed Strategic Architecture
              </h2>
            </div>
            <button
              onClick={() => setShowFullStrategy(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Hide breakdown
            </button>
          </div>

          <PrimaryMissionCard
            mission={activePlan.primary_mission}
            isAllMovesCompleted={completedCount === keyMoves.length && keyMoves.length > 0}
            version={activePlan.version}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DecisionFilterCard filter={activePlan.decision_filter} />
            <EnergyAdviceCard
              advice={activePlan.energy_advice}
              energyLevel={checkin?.energy}
            />
            <ShutdownRitualCard ritual={activePlan.shutdown_ritual || []} />
          </div>
        </div>
      )}

      {/* 5. How to Use Section (Clean, simple, user-requested feature) */}
      {showHowToUse && (
        <div className="pt-2 animate-fade-in">
          <HowToUseSection onClose={() => setShowHowToUse(false)} />
        </div>
      )}

      {/* Replan Modal */}
      <ReplanModal isOpen={isReplanOpen} onClose={() => setIsReplanOpen(false)} />
    </div>
  );
};
