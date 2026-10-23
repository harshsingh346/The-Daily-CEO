import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Sparkles, BatteryCharging, Clock, CheckCircle2, Menu } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatFriendlyDate, formatMinutes } from '../../lib/dates';

interface TopbarProps {
  onOpenReplan: () => void;
  onToggleMobileNav?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenReplan, onToggleMobileNav }) => {
  const navigate = useNavigate();
  const { todayDate, checkin, activePlan } = useData();

  const totalMoves = activePlan?.key_moves?.length || 0;
  const completedMoves = (activePlan?.key_moves || []).filter((m) => m.status === 'completed').length;
  const progressPercent = totalMoves > 0 ? Math.round((completedMoves / totalMoves) * 100) : 0;

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Date & Mobile Menu */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-sm font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <span>{formatFriendlyDate(todayDate)}</span>
            {activePlan && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/[0.08]">
                v{activePlan.version} Active
              </span>
            )}
          </h1>
          <p className="text-[11px] text-slate-400">Personal Chief of Staff Briefing</p>
        </div>
      </div>

      {/* Real-time Executive Indicators & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Indicators */}
        {checkin && (
          <div className="hidden lg:flex items-center gap-2">
            {/* Energy */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[11px]">Energy:</span>
              <span className="font-mono font-semibold text-slate-200 text-xs">{checkin.energy}/10</span>
            </div>

            {/* Time Available */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 text-[11px]">Budget:</span>
              <span className="font-mono font-semibold text-slate-200 text-xs">
                {formatMinutes(checkin.available_minutes)}
              </span>
            </div>

            {/* Completion */}
            {totalMoves > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400 text-[11px]">Execution:</span>
                <span className="font-mono font-semibold text-slate-200 text-xs">
                  {completedMoves}/{totalMoves} ({progressPercent}%)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button: Replan or Checkin */}
        {activePlan ? (
          <button
            onClick={onOpenReplan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 transition text-xs font-medium cursor-pointer shadow-sm active:scale-95"
            title="Adapt your schedule to unexpected changes while preserving completed work"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Replan Day</span>
            <span className="sm:hidden">Replan</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/checkin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition text-xs font-medium cursor-pointer shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Check-in</span>
          </button>
        )}
      </div>
    </header>
  );
};
