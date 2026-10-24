import React, { useState } from 'react';
import { Settings, Shield, Key, Database, RefreshCw, Trash2, Check, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const SettingsPage: React.FC = () => {
  const { user, profile, isGuest, updateProfile, signOut, continueAsDemoUser } = useAuth();
  const { resetToSampleData, clearAllUserData } = useData();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [apiKey, setApiKey] = useState(profile?.preferences?.api_key || '');
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      display_name: displayName.trim(),
      preferences: {
        ...profile?.preferences,
        api_key: apiKey.trim() || undefined,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            System Configuration
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Executive Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your personal chief of staff preferences, cloud persistence, and evaluation demo tools.
        </p>
      </div>

      {/* Profile & Name */}
      <form onSubmit={handleSaveProfile} className="card-ceo rounded-2xl p-6 border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Executive Identity & Profile</h2>
              <p className="text-[11px] text-slate-400">Your registered credentials and executive persona</p>
            </div>
          </div>
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* Profile Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Vance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email</label>
            <input
              type="text"
              disabled
              value={isGuest ? 'demo@executive.io (Demo Workspace)' : user?.email || 'Authenticated Account'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-amber-300/90"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Timezone</label>
            <input
              type="text"
              disabled
              value={profile?.timezone || 'Asia/Kolkata'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Account ID</label>
            <input
              type="text"
              disabled
              value={isGuest ? 'demo-guest-session' : user?.id || '—'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-slate-500 truncate"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span>Optional AI Provider Key (Gemini / OpenAI)</span>
            <span className="text-[10px] text-amber-400 font-mono">Built-in Chief of Staff Active by Default</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-... or AIzaSy... (leave blank to use built-in engine)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Keys are stored strictly in your private local session and never logged.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-semibold shadow-md cursor-pointer transition active:scale-95"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Cloud & Supabase Persistence Status */}
      <div className="card-ceo rounded-2xl p-6 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Supabase Cloud Database & RLS</h2>
              <p className="text-[11px] text-slate-400">PostgreSQL persistence with Row Level Security</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>RLS Active</span>
          </span>
        </div>

        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
            <span className="text-slate-400">Active User:</span>
            <span className="font-mono text-amber-300">
              {isGuest ? 'Demo Workspace' : user?.email || 'Authenticated User'}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
            <span className="text-slate-400">Cloud Status:</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{isGuest ? 'Local Cache Mode' : 'Connected to Supabase PostgreSQL'}</span>
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-400">Row Level Security:</span>
            <span className="text-slate-300 font-mono">Enforced per User ID</span>
          </div>
        </div>
      </div>

      {/* Demo & Presentation Sandbox Controls */}
      <div className="card-executive rounded-xl p-5 border border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.05]">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-100">Evaluation & Demo Utilities</h2>
        </div>

        <p className="text-xs text-slate-400">
          Tools for hackathon judges and evaluators to test full-state scenarios or restore clean seed data with a single click.
        </p>

        {message && (
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            {message}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              resetToSampleData();
              setMessage('Sample dataset loaded successfully!');
              setTimeout(() => setMessage(null), 2500);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.03] hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-white/[0.08] text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset to Sample Dataset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all local data and start with a blank canvas?')) {
                clearAllUserData();
                setMessage('Workspace wiped clean.');
                setTimeout(() => setMessage(null), 2500);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>

          {isGuest ? (
            <button
              type="button"
              onClick={() => {
                window.location.href = '/login';
              }}
              className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Sign in with Supabase Account →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signOut()}
              className="ml-auto text-xs text-slate-400 hover:text-rose-400"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
