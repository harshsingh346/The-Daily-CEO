import React, { useState } from 'react';
import { Compass, Plus, Sparkles, Check, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Decision } from '../types';

export const DecisionRoomPage: React.FC = () => {
  const { decisions, addDecision, updateDecisionChoice } = useData();

  const [isCreating, setIsCreating] = useState(false);
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt1Pros, setOpt1Pros] = useState('');
  const [opt1Cons, setOpt1Cons] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt2Pros, setOpt2Pros] = useState('');
  const [opt2Cons, setOpt2Cons] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !opt1.trim() || !opt2.trim()) return;

    setIsSubmitting(true);
    try {
      await addDecision(question.trim(), [
        {
          id: 'opt-1',
          text: opt1.trim(),
          pros: opt1Pros.split(',').map((s) => s.trim()).filter(Boolean),
          cons: opt1Cons.split(',').map((s) => s.trim()).filter(Boolean),
        },
        {
          id: 'opt-2',
          text: opt2.trim(),
          pros: opt2Pros.split(',').map((s) => s.trim()).filter(Boolean),
          cons: opt2Cons.split(',').map((s) => s.trim()).filter(Boolean),
        },
      ]);
      setQuestion('');
      setOpt1('');
      setOpt1Pros('');
      setOpt1Cons('');
      setOpt2('');
      setOpt2Pros('');
      setOpt2Cons('');
      setIsCreating(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Strategic Decision Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Executive Decision Room
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structure high-stakes choices, analyze trade-offs, identify blind spots, and commit decisively.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Decision</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="card-executive rounded-xl p-5 border border-indigo-500/30 space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-100">Structure a New Decision</h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Core Decision Question <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should we adopt managed infrastructure or build lightweight in-house?"
              className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1 */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
              <span className="text-[11px] font-mono text-indigo-300 font-semibold uppercase block">Option A</span>
              <input
                type="text"
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
                placeholder="Option name / description"
                className="w-full px-3 py-1.5 rounded-md bg-black/40 border border-white/[0.08] text-xs text-slate-100 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={opt1Pros}
                onChange={(e) => setOpt1Pros(e.target.value)}
                placeholder="Pros (comma separated)"
                className="w-full px-3 py-1.5 rounded-md bg-black/40 border border-white/[0.08] text-xs text-slate-200"
              />
              <input
                type="text"
                value={opt1Cons}
                onChange={(e) => setOpt1Cons(e.target.value)}
                placeholder="Cons / Risks (comma separated)"
                className="w-full px-3 py-1.5 rounded-md bg-black/40 border border-white/[0.08] text-xs text-slate-200"
              />
            </div>

            {/* Option 2 */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
              <span className="text-[11px] font-mono text-sky-300 font-semibold uppercase block">Option B</span>
              <input
                type="text"
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
                placeholder="Option name / description"
                className="w-full px-3 py-1.5 rounded-md bg-black/40 border border-white/[0.08] text-xs text-slate-100 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={opt2Pros}
                onChange={(e) => setOpt2Pros(e.target.value)}
                placeholder="Pros (comma separated)"
                className="w-full px-3 py-1.5 rounded-md bg-black/40 border border-white/[0.08] text-xs text-slate-200"
              />
              <input
                type="text"
                value={opt2Cons}
                onChange={(e) => setOpt2Cons(e.target.value)}
                placeholder="Cons / Risks (comma separated)"
                className="w-full px-3 py-1.5 rounded-md bg-black/40 border border-white/[0.08] text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Synthesizing Matrix...' : 'Synthesize Decision Analysis'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Decisions List */}
      <div className="space-y-6">
        {decisions.map((dec) => (
          <div key={dec.id} className="card-executive rounded-xl p-5 border border-white/[0.08] space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                  Strategic Matrix
                </span>
                <h2 className="text-base font-semibold text-slate-100 tracking-tight mt-0.5">
                  {dec.question}
                </h2>
              </div>
              {dec.chosen_option && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  Committed Option
                </span>
              )}
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dec.options.map((opt) => {
                const isSelected = dec.chosen_option === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => updateDecisionChoice(dec.id, opt.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-950/30 border-indigo-500/50 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-200">{opt.text}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'border-white/[0.2]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>

                    {opt.pros.length > 0 && (
                      <div className="text-[11px] text-emerald-400/90 mt-1 space-y-0.5">
                        {opt.pros.map((p, i) => (
                          <div key={i}>+ {p}</div>
                        ))}
                      </div>
                    )}
                    {opt.cons.length > 0 && (
                      <div className="text-[11px] text-rose-400/80 mt-1 space-y-0.5">
                        {opt.cons.map((c, i) => (
                          <div key={i}>- {c}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Strategic Synthesis */}
            {dec.analysis && (
              <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-300 font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Chief of Staff Assessment
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {dec.analysis.recommendation}
                </p>
                <div className="text-slate-400 text-[11px] space-y-1 pt-1 border-t border-white/[0.04]">
                  <div><strong className="text-slate-300">Core Trade-off:</strong> {dec.analysis.tradeoffs}</div>
                  {dec.analysis.missingInfo && (
                    <div><strong className="text-amber-300">Blind Spots:</strong> {dec.analysis.missingInfo}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
