import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  Check,
  X,
  Bot,
  Lightbulb,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatFriendlyDate } from '../lib/dates';
import type { JournalEntry, JournalEntryType } from '../types';

export const JournalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, generateJournalReflection } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form State
  const [entryType, setEntryType] = useState<JournalEntryType>('reflection');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('focused');
  const [isGeneratingAI, setIsGeneratingAI] = useState<Record<string, boolean>>({});

  const types: { id: JournalEntryType; label: string }[] = [
    { id: 'reflection', label: 'Reflection' },
    { id: 'win', label: 'Win' },
    { id: 'decision', label: 'Decision' },
    { id: 'idea', label: 'Idea' },
    { id: 'lesson', label: 'Lesson' },
    { id: 'freewrite', label: 'Freewrite' },
  ];

  const prompts = [
    'What single outcome mattered most today?',
    'What went noticeably better than anticipated?',
    'What interrupted your focus, and how will you prevent it?',
    'What uncomfortable decision are you postponing?',
    'What is one high-leverage move for tomorrow morning?',
  ];

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      (entry.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || entry.entry_type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addJournalEntry(entryType, content.trim(), title.trim() || undefined, mood);
    setIsCreating(false);
    setTitle('');
    setContent('');
  };

  const handleTriggerAI = async (entryId: string) => {
    setIsGeneratingAI((prev) => ({ ...prev, [entryId]: true }));
    try {
      await generateJournalReflection(entryId);
    } finally {
      setIsGeneratingAI((prev) => ({ ...prev, [entryId]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              CEO Executive Journal
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Strategic Reflections & Decisions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document milestones, strategic pivots, and lessons. AI synthesis is strictly opt-in per entry.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Quick Prompt Ideas Carousel / Banner */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3 overflow-x-auto scrollbar-none">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-[11px] text-slate-400 font-semibold shrink-0">Prompts:</span>
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTitle(p);
              setIsCreating(true);
            }}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-indigo-600/20 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 border border-white/[0.06] transition cursor-pointer shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* New Entry Modal / Form */}
      {isCreating && (
        <form onSubmit={handleSaveNew} className="card-executive rounded-xl p-5 border border-indigo-500/30 space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-100">Draft Executive Entry</h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Entry Type</label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as JournalEntryType)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-200 focus:border-indigo-500"
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Architecture Pivot & Focus Breakthrough"
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Reflection Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record the situation, your strategic intuition, what worked, or what you learned..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              required
            />
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
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/30 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium transition cursor-pointer ${
              selectedType === 'all'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-2.5 py-1 text-xs rounded-md border font-medium capitalize transition cursor-pointer ${
                selectedType === t.id
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Feed */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 border border-white/[0.06] rounded-xl bg-white/[0.01]">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No journal entries found</p>
          <p className="text-xs text-slate-400 mt-1">Start by capturing a win, decision, or daily reflection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="card-executive rounded-xl p-5 border border-white/[0.08] space-y-3">
              {/* Entry Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {entry.entry_type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatFriendlyDate(entry.local_date)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteJournalEntry(entry.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Body */}
              {entry.title && (
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                  {entry.title}
                </h3>
              )}
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>

              {/* AI Reflection Section */}
              {entry.ai_summary ? (
                <div className="mt-3 p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-indigo-300">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      Chief of Staff Reflection
                    </span>
                    <button
                      onClick={() => updateJournalEntry(entry.id, { ai_summary: null, ai_analysis_enabled: false })}
                      className="text-[10px] text-slate-400 hover:text-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-xs text-indigo-100 whitespace-pre-wrap leading-relaxed">
                    {entry.ai_summary}
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-end">
                  <button
                    onClick={() => handleTriggerAI(entry.id)}
                    disabled={isGeneratingAI[entry.id]}
                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingAI[entry.id] ? 'Synthesizing...' : 'Generate AI Reflection'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
