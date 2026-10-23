import React from 'react';
import { Calendar, Check, FileText, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import type { KeyMove } from '../../types';

interface CommandCenterTimelineProps {
  keyMoves: KeyMove[];
  onToggleMove: (moveId: string) => void;
  onOpenReplan: () => void;
}

export const CommandCenterTimeline: React.FC<CommandCenterTimelineProps> = ({
  keyMoves,
  onToggleMove,
}) => {
  const hours = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM'
  ];

  // Map moves onto realistic timeline slots if not specified
  const timeSlots = [
    {
      time: '8:30 AM – 9:30 AM',
      color: 'bg-sky-400',
      badge: 'Priority 1',
      badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      icon: CheckCircle2,
      left: '4%',
      width: '28%',
    },
    {
      time: '12:30 PM – 2:00 PM',
      color: 'bg-emerald-400',
      badge: 'Important',
      badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      icon: FileText,
      left: '36%',
      width: '32%',
    },
    {
      time: '5:00 PM – 6:30 PM',
      color: 'bg-rose-400',
      badge: 'High Impact',
      badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      icon: Phone,
      left: '70%',
      width: '28%',
    },
  ];

  return (
    <div className="card-ceo rounded-2xl p-6 relative overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400 shadow-inner">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2">
              Today's Command Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Your plan. Your focus. Your progress.</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.05]">
          8:00 AM – 8:00 PM Timeline
        </span>
      </div>

      {/* Horizontal Timeline Container */}
      <div className="relative pt-2 pb-6 overflow-x-auto scrollbar-none min-w-[700px]">
        {/* Hours Header */}
        <div className="flex justify-between border-b border-white/[0.06] pb-3 text-[11px] font-mono text-slate-400 select-none">
          {hours.map((hour) => (
            <div key={hour} className="text-center w-12 shrink-0">
              {hour}
            </div>
          ))}
        </div>

        {/* Vertical Dashed Guide Lines */}
        <div className="absolute inset-0 top-9 pointer-events-none flex justify-between z-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="w-12 shrink-0 border-r border-dashed border-white/[0.04] h-full"
            />
          ))}
        </div>

        {/* Scheduled Task Blocks */}
        <div className="relative z-10 pt-6 pb-2 space-y-4">
          {keyMoves.slice(0, 3).map((move, idx) => {
            const slot = timeSlots[idx] || timeSlots[0];
            const isCompleted = move.status === 'completed';
            const Icon = slot.icon;

            return (
              <div
                key={move.id}
                style={{ marginLeft: slot.left, width: slot.width }}
                onClick={() => onToggleMove(move.id)}
                className={`card-interactive rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 cursor-pointer shadow-lg transition-all duration-200 select-none ${
                  isCompleted
                    ? 'bg-[#121620]/80 border-emerald-500/40 opacity-75'
                    : 'bg-[#171b26]/95 border-white/[0.09] hover:border-amber-400/40'
                }`}
              >
                {/* Dot & Icon */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isCompleted ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : slot.color
                    }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`text-xs font-semibold tracking-tight truncate leading-tight ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {move.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {slot.time}
                    </p>
                  </div>
                </div>

                {/* Priority Badge */}
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 font-semibold ${
                    isCompleted ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : slot.badgeClass
                  }`}
                >
                  {isCompleted ? 'Done' : slot.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
