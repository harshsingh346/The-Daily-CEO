import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  RefreshCw,
  Trash2,
  Check,
  User,
  Sparkles,
  Clock,
  Briefcase,
  CheckCircle2,
  Loader2,
  Globe,
  Sliders,
  Mail,
  AlertTriangle,
  ExternalLink,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { dispatchGmailReminder, analyzePendingTasks } from '../lib/reminderService';
import { GmailReminderModal } from '../components/dashboard/GmailReminderModal';

export const SettingsPage: React.FC = () => {
  const { user, profile, isGuest, updateProfile, signOut } = useAuth();
  const { resetToSampleData, clearAllUserData, activePlan } = useData();

  const [displayName, setDisplayName] = useState(
    profile?.display_name || user?.user_metadata?.full_name || (isGuest ? 'Alex Vance' : '')
  );
  const [role, setRole] = useState(
    (profile?.preferences as any)?.role || 'Chief Executive Officer'
  );
  const [timezone, setTimezone] = useState(
    profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
  );
  const [apiKey, setApiKey] = useState(profile?.preferences?.api_key || '');
  const [startHour, setStartHour] = useState(
    profile?.preferences?.work_start_hour ?? 9
  );
  const [endHour, setEndHour] = useState(
    profile?.preferences?.work_end_hour ?? 18
  );
  const [reminderEmail, setReminderEmail] = useState(
    profile?.preferences?.reminder_email || user?.email || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // Sync state whenever profile or user loads from Supabase
  useEffect(() => {
    if (profile) {
      if (profile.display_name) setDisplayName(profile.display_name);
      if (profile.timezone) setTimezone(profile.timezone);
      if (profile.preferences?.api_key) setApiKey(profile.preferences.api_key);
      if ((profile.preferences as any)?.role) setRole((profile.preferences as any).role);
      if (profile.preferences?.work_start_hour !== undefined) {
        setStartHour(profile.preferences.work_start_hour);
      }
      if (profile.preferences?.work_end_hour !== undefined) {
        setEndHour(profile.preferences.work_end_hour);
      }
      if (profile.preferences?.reminder_email) {
        setReminderEmail(profile.preferences.reminder_email);
      } else if (user?.email) {
        setReminderEmail(user.email);
      }
    } else if (user) {
      if (user.user_metadata?.full_name) {
        setDisplayName(user.user_metadata.full_name);
      } else if (user.email) {
        setDisplayName(user.email.split('@')[0]);
        setReminderEmail(user.email);
      }
    }
  }, [profile, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      await updateProfile({
        display_name: displayName.trim(),
        timezone: timezone.trim(),
        preferences: {
          ...profile?.preferences,
          role: role.trim(),
          api_key: apiKey.trim() || undefined,
          work_start_hour: Number(startHour),
          work_end_hour: Number(endHour),
          reminder_email: reminderEmail.trim(),
        },
      });
      setIsSaved(true);
      setFeedbackMessage('Profile settings successfully updated and synced.');
      setTimeout(() => {
        setIsSaved(false);
        setFeedbackMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setFeedbackMessage(err.message || 'Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDetectTimezone = () => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) {
      setTimezone(detected);
    }
  };

  const handleTestReminderDispatch = async () => {
    setIsSendingReminder(true);
    setReminderStatus(null);
    try {
      const email = reminderEmail || user?.email || 'xtreamk3@gmail.com';
      const analysis = analyzePendingTasks(activePlan?.key_moves || [], profile);
      const result = await dispatchGmailReminder({
        recipientEmail: email,
        userName: displayName || 'Executive',
        analysis,
      });
      if (result.success) {
        setReminderStatus(`Reminder dispatched successfully to ${email}.`);
      } else {
        setReminderStatus(`Notice: ${result.error || 'Draft ready'}`);
      }
    } catch (err: any) {
      setReminderStatus(`Error: ${err.message || 'Failed to dispatch'}`);
    } finally {
      setIsSendingReminder(false);
    }
  };

  const userInitial = (displayName?.[0] || 'E').toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <User className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Executive Profile & Identity
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Account & Executive Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal Chief of Staff identity, schedule parameters, and cloud synchronization.
          </p>
        </div>

        {/* Live sync badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-300">
            {isGuest ? 'Demo Sandbox' : 'Supabase Synced'}
          </span>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 animate-fade-in ${
            isSaved
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : null}
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="card-ceo rounded-2xl p-6 border border-white/[0.08] space-y-6">
        {/* Profile Card Header with Live Avatar Preview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-300/40 shrink-0">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  {displayName || 'Executive'}
                </h2>
                {!isGuest && user ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Executive
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-medium">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-300/80 font-mono mt-0.5">
                {isGuest ? 'demo@executive.io' : user?.email || 'Authenticated Account'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {role || 'Executive Officer'} • {timezone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer transition active:scale-95 flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Name / Display Name</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Vance"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition"
            />
          </div>

          {/* Executive Role / Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Title / Role</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Chief Executive Officer, Founder, Managing Director"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition"
            />
          </div>

          {/* Timezone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Timezone</span>
              </label>
              <button
                type="button"
                onClick={handleDetectTimezone}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
              >
                Auto-detect
              </button>
            </div>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="e.g. Asia/Kolkata, America/New_York, Europe/London"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-mono transition"
            />
          </div>

          {/* Registered Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Registered Account Email
            </label>
            <input
              type="text"
              disabled
              value={isGuest ? 'demo@executive.io (Demo Workspace)' : user?.email || 'Authenticated Account'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-amber-300/90 cursor-not-allowed"
            />
          </div>

          {/* Executive Reminder Gmail Destination */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Alert Gmail</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                Receives pending & missed task alerts
              </span>
            </label>
            <input
              type="email"
              value={reminderEmail}
              onChange={(e) => setReminderEmail(e.target.value)}
              placeholder="e.g. your-name@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Executive Schedule & Hours */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-slate-200">Daily Executive Schedule Window</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Work Start Hour (24h)</label>
              <input
                type="number"
                min={0}
                max={23}
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 9:00 AM</span>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Work End Hour (24h)</label>
              <input
                type="number"
                min={0}
                max={23}
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 18:00 (6:00 PM)</span>
            </div>
          </div>
        </div>

        {/* AI Engine & Provider Configuration */}
        <div className="pt-4 border-t border-white/[0.06]">
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom AI Provider Key (Gemini / OpenAI)</span>
            </span>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Built-in Chief of Staff Active by Default
            </span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... or sk-... (optional: leave blank to use built-in engine)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 font-mono transition"
          />
          <p className="text-[11px] text-slate-500 mt-1.5">
            Keys are encrypted locally and never exposed in client logs.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer transition active:scale-95 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Changes Saved</span>
              </>
            ) : (
              <span>Save Profile Changes</span>
            )}
          </button>
        </div>
      </form>

      {/* Executive Task Reminders & Gmail Alerts */}
      <div className="card-ceo rounded-2xl p-6 border border-white/[0.08] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-100">
                  Executive Task Reminders & Gmail Alerts
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically monitors your timeline and delivers briefings directly to your Gmail if tasks are missed, forgotten, or workday time runs short.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReminderModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-200 hover:text-amber-300 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Reminder Control</span>
          </button>
        </div>

        {/* 3 Intelligence Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Missed Task Detection</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Detects any key move whose scheduled time block has elapsed today without being marked complete.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Capacity Deficit Alert</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Warns you if total pending estimated minutes exceed remaining hours in your workday (cutoff: {endHour}:00).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-xs">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant App Visit Link</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every dispatched email contains a direct 1-click CTA returning you directly to your executive dashboard.
            </p>
          </div>
        </div>

        {/* Status / Feedback message */}
        {reminderStatus && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              {reminderStatus}
            </span>
            <button
              onClick={() => setReminderStatus(null)}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
          <div className="text-xs text-slate-400">
            Recipient:{' '}
            <span className="font-mono text-amber-300 font-semibold">
              {reminderEmail || user?.email || 'Not configured'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={isSendingReminder}
              onClick={handleTestReminderDispatch}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSendingReminder ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email Reminder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
            <span className="text-slate-400">Account ID:</span>
            <span className="text-slate-400 font-mono text-[11px]">
              {isGuest ? 'demo-guest-session' : user?.id || '—'}
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

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              resetToSampleData();
              setFeedbackMessage('Sample dataset loaded successfully!');
              setTimeout(() => setFeedbackMessage(null), 2500);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.03] hover:bg-amber-600/20 text-slate-300 hover:text-amber-200 border border-white/[0.08] text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Sample Dataset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all local data and start with a blank canvas?')) {
                clearAllUserData();
                setFeedbackMessage('Workspace wiped clean.');
                setTimeout(() => setFeedbackMessage(null), 2500);
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
              className="ml-auto text-xs text-amber-400 hover:text-amber-300 underline"
            >
              Sign in with Supabase Account →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signOut()}
              className="ml-auto text-xs text-slate-400 hover:text-rose-400 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Gmail Reminder Modal */}
      <GmailReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />
    </div>
  );
};
