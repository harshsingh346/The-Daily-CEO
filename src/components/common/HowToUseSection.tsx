import React from 'react';
import { Sparkles, CheckCircle2, Clock, RefreshCw, Moon, ArrowRight, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HowToUseSectionProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const HowToUseSection: React.FC<HowToUseSectionProps> = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: '60-Second Check-in',
      subtitle: 'Anchor your day with reality',
      desc: 'Set your true vitality (1–10), available focus budget, and single top outcome. Your AI chief of staff calibrates a realistic strategy that never over-schedules your capacity.',
      action: 'Start Check-in',
      link: '/checkin',
      icon: Sparkles,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      step: '02',
      title: 'Command Center Execution',
      subtitle: '3 ranked Key Moves on your timeline',
      desc: 'Work through your high-leverage moves mapped onto your daytime timeline. Check off moves as they finish to track momentum and lock verifiable timestamps.',
      action: 'View Timeline',
      link: '/',
      icon: CheckCircle2,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    },
    {
      step: '03',
      title: 'Adaptive Replan Mode',
      subtitle: 'Preserve completed progress when life shifts',
      desc: 'When an unexpected fire drill cuts your remaining hours, tap "Replan Day". It locks your finished work in history and trims pending tasks to fit your new reality.',
      action: 'Replan Day',
      link: '/',
      icon: RefreshCw,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
    {
      step: '04',
      title: 'Evening Review & Journal',
      subtitle: 'Turn daily reflection into compounding clarity',
      desc: 'Close your shutdown ritual, celebrate wins, log friction points, and queue up tomorrow morning’s opening move before signing off.',
      action: 'Evening Debrief',
      link: '/review',
      icon: Moon,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
  ];

  const content = (
    <div className="card-ceo rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-bold">
              Executive Workflow Guide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            How to Use <span className="text-gold-gradient">The Daily CEO</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Unlike conventional chaotic to-do lists, The Daily CEO is an executive operating system built around realistic time budgets, intentional focus, and compounding reflection.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/30 transition flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400/80">
                    {s.step}
                  </span>
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${s.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-100 tracking-tight group-hover:text-amber-200 transition">
                  {s.title}
                </h3>
                <p className="text-[11px] font-medium text-amber-400/80 mt-0.5">
                  {s.subtitle}
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  navigate(s.link);
                }}
                className="text-[11px] text-slate-300 hover:text-amber-300 font-semibold flex items-center gap-1 pt-2 transition cursor-pointer"
              >
                <span>{s.action}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Pro Tips Footer */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/[0.07] to-amber-600/[0.02] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            <strong>Pro Tip:</strong> Press <kbd className="font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/[0.1] text-amber-300">⌘K</kbd> anywhere to open your private conversational AI chief of staff.
          </span>
        </div>

        <button
          onClick={() => {
            if (onClose) onClose();
            navigate('/checkin');
          }}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition cursor-pointer shadow-md self-start sm:self-auto shrink-0"
        >
          Begin Today's Check-in →
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="max-w-4xl w-full my-8">{content}</div>
      </div>
    );
  }

  return content;
};
