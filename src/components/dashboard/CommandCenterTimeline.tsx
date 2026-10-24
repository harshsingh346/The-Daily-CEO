import React from 'react';
import { Calendar, Check, FileText, Phone, Sparkles, CheckCircle2, Plus, RefreshCw, Trash2, Zap, Target, Mail } from 'lucide-react';
import type { KeyMove } from '../../types';

interface CommandCenterTimelineProps {
  keyMoves: KeyMove[];
  onToggleMove: (moveId: string) => void;
  onOpenReplan: () => void;
  onOpenAddWidget?: () => void;
  onOpenGmailReminder?: () => void;
  onDeleteMove?: (moveId: string) => void;
}

// Helper to estimate timeline horizontal position (8 AM - 8 PM = 12 hours)
function getTimelinePosition(move: KeyMove, idx: number, total: number) {
  const timeStr = move.completionCriteria || '';
  
  // Try to parse hour from strings like "9:00 AM", "11:30 AM", "2:00 PM", "5:30 PM"
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const meridian = match[3].toUpperCase();

    if (meridian === 'PM' && hour !== 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;

    // Constrain to 8 AM (8.0) to 8 PM (20.0)
    const normalizedHour = Math.max(8, Math.min(20, hour + minute / 60));
    const offsetFrom8am = normalizedHour - 8;
    const leftPercent = Math.min(70, Math.max(2, (offsetFrom8am / 12) * 100));

    const durationMin = move.estimated_minutes || 45;
    const widthPercent = Math.max(26, Math.min(38, (durationMin / 720) * 100 * 3));

    return {
      left: `${leftPercent}%`,
      width: `${Math.min(widthPercent, 98 - leftPercent)}%`,
    };
  }

  // Fallback sequential staggered distribution across the day
  const defaultSlots = [
    { left: '4%', width: '28%' },
    { left: '34%', width: '30%' },
    { left: '68%', width: '28%' },
    { left: '16%', width: '28%' },
    { left: '48%', width: '30%' },
    { left: '24%', width: '28%' },
    { left: '56%', width: '28%' },
  ];

  return defaultSlots[idx % defaultSlots.length];
}

// Preset color palettes for widgets
const WIDGET_THEMES = [
  {
    color: 'bg-amber-400',
    badge: 'Priority 1',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    icon: Zap,
  },
  {
    color: 'bg-emerald-400',
    badge: 'Strategic',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    icon: CheckCircle2,
  },
  {
    color: 'bg-sky-400',
    badge: 'High Impact',
    badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    icon: Target,
  },
  {
    color: 'bg-indigo-400',
    badge: 'Focus Block',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    icon: FileText,
  },
  {
    color: 'bg-rose-400',
    badge: 'Executive',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    icon: Phone,
  },
];

export const CommandCenterTimeline: React.FC<CommandCenterTimelineProps> = ({
  keyMoves,
  onToggleMove,
  onOpenReplan,
  onOpenAddWidget,
  onDeleteMove,
  onOpenGmailReminder,
}) => {
  const hours = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM'
  ];

  const completedMoves = keyMoves.filter((m) => m.status === 'completed');

  return (
    <div className="card-ceo rounded-2xl p-6 relative overflow-hidden border border-white/[0.08] shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span>Today's Command Center</span>
              <span className="text-[11px] font-mono text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {keyMoves.length} {keyMoves.length === 1 ? 'Widget' : 'Widgets'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your active plan, scheduled timeline, and executive priorities.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenAddWidget && (
            <button
              onClick={onOpenAddWidget}
              className="h-8 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add widget</span>
            </button>
          )}

          {onOpenGmailReminder && (
            <button
              onClick={onOpenGmailReminder}
              className="h-8 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Send pending or missed task reminders to Gmail"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Gmail Reminder</span>
            </button>
          )}

          <button
            onClick={onOpenReplan}
            className="h-8 px-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            title="Recalibrate remaining day"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Replan</span>
          </button>

          <span className="text-[10px] font-mono text-slate-400 bg-white/[0.02] px-2 py-1 rounded-lg border border-white/[0.05] hidden md:inline">
            8 AM – 8 PM
          </span>
        </div>
      </div>

      {/* Empty State when no key moves exist */}
      {keyMoves.length === 0 ? (
        <div className="py-12 px-4 rounded-xl border border-dashed border-white/[0.1] text-center space-y-3 bg-white/[0.01]">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">No Widgets Scheduled Today</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add your first executive widget or high-impact focus block to start populating your Command Center.
            </p>
          </div>
          {onOpenAddWidget && (
            <button
              onClick={onOpenAddWidget}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold shadow-md cursor-pointer transition active:scale-95 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Your First Widget</span>
            </button>
          )}
        </div>
      ) : (
        /* Horizontal Timeline Container */
        <div className="relative pt-2 pb-4 overflow-x-auto scrollbar-none min-w-[700px]">
          {/* Hours Header Grid */}
          <div className="flex justify-between border-b border-white/[0.06] pb-2 text-[11px] font-mono text-slate-400 select-none">
            {hours.map((hour) => (
              <div key={hour} className="text-center w-12 shrink-0">
                {hour}
              </div>
            ))}
          </div>

          {/* Vertical Dashed Guide Lines */}
          <div className="absolute inset-0 top-8 pointer-events-none flex justify-between z-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="w-12 shrink-0 border-r border-dashed border-white/[0.04] h-full"
              />
            ))}
          </div>

          {/* Scheduled Task Blocks (ALL KEY MOVES RENDERED - NO SLICE CUTOFF) */}
          <div className="relative z-10 pt-4 pb-2 space-y-3.5">
            {keyMoves.map((move, idx) => {
              const theme = WIDGET_THEMES[idx % WIDGET_THEMES.length];
              const slotPos = getTimelinePosition(move, idx, keyMoves.length);
              const isCompleted = move.status === 'completed';
              const Icon = theme.icon;

              const displayTime =
                move.completionCriteria ||
                (idx === 0
                  ? '8:30 AM – 9:30 AM'
                  : idx === 1
                  ? '10:00 AM – 11:30 AM'
                  : idx === 2
                  ? '1:00 PM – 2:30 PM'
                  : `${move.estimated_minutes || 45} mins`);

              return (
                <div
                  key={move.id}
                  style={{ marginLeft: slotPos.left, width: slotPos.width }}
                  className={`group card-interactive rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 shadow-lg transition-all duration-200 select-none min-w-[240px] ${
                    isCompleted
                      ? 'bg-[#121620]/80 border-emerald-500/40 opacity-75'
                      : 'bg-[#151924]/95 border-white/[0.1] hover:border-amber-400/50 hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.15)]'
                  }`}
                >
                  {/* Left: Checkbox & Title */}
                  <div
                    onClick={() => onToggleMove(move.id)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isCompleted ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : theme.color
                      }`}
                    />

                    {/* Completion Checkmark Icon */}
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-300 group-hover:border-amber-400/40'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Widget Title & Time */}
                    <div className="min-w-0 flex-1">
                      <h3
                        title={move.title}
                        className={`text-xs font-bold tracking-tight truncate leading-tight ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-amber-300 transition'
                        }`}
                      >
                        {move.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {displayTime}
                        </span>
                        {move.estimated_minutes && (
                          <span className="text-[9px] text-amber-400/80 font-mono">
                            • {move.estimated_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Priority Badge & Delete button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 font-semibold ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                          : theme.badgeClass
                      }`}
                    >
                      {isCompleted ? 'Done' : `P${move.priority || idx + 1}`}
                    </span>

                    {onDeleteMove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMove(move.id);
                        }}
                        title="Delete widget"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
