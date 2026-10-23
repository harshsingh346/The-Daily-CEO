import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  BookOpen,
  Moon,
  ArrowRight,
  Target,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PrimaryMissionCard } from '../components/dashboard/PrimaryMissionCard';
import { KeyMoveCard } from '../components/dashboard/KeyMoveCard';
import { DecisionFilterCard } from '../components/dashboard/DecisionFilterCard';
import { EnergyAdviceCard } from '../components/dashboard/EnergyAdviceCard';
import { ShutdownRitualCard } from '../components/dashboard/ShutdownRitualCard';
import { ReplanModal } from '../components/dashboard/ReplanModal';
import { formatMinutes } from '../lib/dates';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { activePlan, checkin, toggleKeyMove, isLoading } = useData();
  const [isReplanOpen, setIsReplanOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse max-w-5xl mx-auto py-8">
        <div className="h-8 bg-white/[0.04] rounded-lg w-1/3" />
        <div className="h-44 bg-white/[0.03] rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-white/[0.03] rounded-xl" />
          <div className="h-32 bg-white/[0.03] rounded-xl" />
          <div className="h-32 bg-white/[0.03] rounded-xl" />
        </div>
      </div>
    );
  }

  // First-use empty state if no active plan
  if (!activePlan) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          No Daily Strategy Formulated Yet
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          The Daily CEO organizes your day through a fast 60-second check-in. Tell your chief of staff your energy, time budget, and top goal.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/checkin')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Begin Daily Check-in</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  const keyMoves = activePlan.key_moves || [];
  const completedMoves = keyMoves.filter((m) => m.status === 'completed');
  const isAllMovesCompleted = keyMoves.length > 0 && completedMoves.length === keyMoves.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Executive Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Welcome, {profile?.display_name || user?.email?.split('@')[0] || 'Chief Executive'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAllMovesCompleted
              ? 'All Key Moves completed! Primary mission accomplished for today.'
              : `${completedMoves.length} of ${keyMoves.length} key moves executed. Maintain focus on the critical path.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsReplanOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-white/[0.08] hover:border-indigo-500/30 text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Replan Day</span>
          </button>

          <button
            onClick={() => navigate('/journal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-medium transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Journal</span>
          </button>

          <button
            onClick={() => navigate('/review')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition cursor-pointer"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Review</span>
          </button>
        </div>
      </div>

      {/* Primary Mission Card */}
      <PrimaryMissionCard
        mission={activePlan.primary_mission}
        isAllMovesCompleted={isAllMovesCompleted}
        version={activePlan.version}
      />

      {/* Key Moves Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Ranked Key Moves ({completedMoves.length}/{keyMoves.length} Done)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {keyMoves.reduce((acc, m) => acc + m.estimated_minutes, 0)}m planned
          </span>
        </div>

        <div className="space-y-3">
          {keyMoves.map((move) => (
            <KeyMoveCard key={move.id} move={move} onToggle={toggleKeyMove} />
          ))}
        </div>
      </div>

      {/* Strategic Trio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <DecisionFilterCard filter={activePlan.decision_filter} />
        <EnergyAdviceCard
          advice={activePlan.energy_advice}
          energyLevel={checkin?.energy}
        />
        <ShutdownRitualCard ritual={activePlan.shutdown_ritual || []} />
      </div>

      {/* Modals */}
      <ReplanModal isOpen={isReplanOpen} onClose={() => setIsReplanOpen(false)} />
    </div>
  );
};
