import React, { useState } from 'react';
import { X, Plus, Sparkles, Clock, AlertCircle, CheckCircle2, Zap, Target, Phone, BarChart2, Users, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetOption {
  title: string;
  duration: number;
  priority: 1 | 2 | 3;
  timeSlot: string;
  category: string;
  icon: React.ElementType;
}

const PRESET_WIDGETS: PresetOption[] = [
  {
    title: 'Deep Work Sprint',
    duration: 60,
    priority: 1,
    timeSlot: '9:00 AM – 10:00 AM',
    category: 'Focus',
    icon: Zap,
  },
  {
    title: 'Executive Strategy Call',
    duration: 45,
    priority: 1,
    timeSlot: '11:00 AM – 11:45 AM',
    category: 'Strategy',
    icon: Phone,
  },
  {
    title: 'Board / Investor Deck Review',
    duration: 60,
    priority: 1,
    timeSlot: '1:00 PM – 2:00 PM',
    category: 'High Impact',
    icon: Target,
  },
  {
    title: 'Product & Tech Architecture Sync',
    duration: 45,
    priority: 2,
    timeSlot: '2:30 PM – 3:15 PM',
    category: 'Product',
    icon: CheckCircle2,
  },
  {
    title: 'Financial & Metrics Review',
    duration: 30,
    priority: 2,
    timeSlot: '4:00 PM – 4:30 PM',
    category: 'Operations',
    icon: BarChart2,
  },
  {
    title: 'Leadership 1-on-1 Coaching',
    duration: 30,
    priority: 2,
    timeSlot: '5:00 PM – 5:30 PM',
    category: 'People',
    icon: Users,
  },
  {
    title: 'CEO Strategic Journal Reflection',
    duration: 25,
    priority: 3,
    timeSlot: '6:00 PM – 6:25 PM',
    category: 'Reflection',
    icon: BookOpen,
  },
];

const COMMON_TIME_SLOTS = [
  '8:30 AM – 9:30 AM',
  '10:00 AM – 11:15 AM',
  '11:30 AM – 12:30 PM',
  '1:00 PM – 2:30 PM',
  '3:00 PM – 4:00 PM',
  '4:30 PM – 5:30 PM',
  '6:00 PM – 7:00 PM',
];

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose }) => {
  const { addKeyMove } = useData();

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(45);
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [timeSlot, setTimeSlot] = useState('10:00 AM – 11:00 AM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: PresetOption) => {
    setTitle(preset.title);
    setDuration(preset.duration);
    setPriority(preset.priority);
    setTimeSlot(preset.timeSlot);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your command center widget.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addKeyMove(
        title.trim(),
        duration,
        priority,
        description.trim() || undefined,
        timeSlot.trim() || undefined
      );

      // Reset and close
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      console.error('Error adding widget:', err);
      setError(err?.message || 'Failed to add widget to Command Center.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="card-ceo bg-[#0e121a]/95 border border-white/[0.12] rounded-2xl max-w-lg w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Add Command Center Widget</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Priority Move
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Schedule a new high-leverage focus block or executive priority on your timeline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Presets Carousel/Pills */}
          <div>
            <label className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Executive Presets (1-Click)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_WIDGETS.map((p) => {
                const Icon = p.icon;
                const isSelected = title === p.title;
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`p-2 rounded-xl border text-left transition flex items-center gap-2 select-none cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-medium truncate">{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Widget Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Widget Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Review Q3 Investor Deck & Cap Table"
              autoFocus
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition font-medium"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This title will be prominently displayed on your Command Center timeline.
            </p>
          </div>

          {/* Scheduled Time Window */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Scheduled Time Slot</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">8:00 AM – 8:00 PM window</span>
            </div>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              placeholder="e.g. 10:00 AM – 11:30 AM"
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 font-mono transition"
            />
            {/* Quick time slot chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                    timeSlot === slot
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                      : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Estimated Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#121622] border border-white/[0.1] text-xs text-slate-100 focus:border-amber-400 transition"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Standard)</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={90}>90 Minutes (Deep Work)</option>
                <option value={120}>120 Minutes (2 Hours)</option>
              </select>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2 rounded-xl bg-[#121622] border border-white/[0.1] text-xs text-slate-100 focus:border-amber-400 transition"
              >
                <option value={1}>Priority 1 — High Impact</option>
                <option value={2}>Priority 2 — Strategic Move</option>
                <option value={3}>Priority 3 — Operational</option>
              </select>
            </div>
          </div>

          {/* Optional Focus Criteria */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Optional Success Criteria / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Clear next steps approved by leadership team."
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 transition"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer transition active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isSubmitting ? 'Adding...' : 'Add to Command Center'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
