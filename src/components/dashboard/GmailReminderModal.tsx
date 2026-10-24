import React, { useState } from 'react';
import {
  X,
  Mail,
  AlertTriangle,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { analyzePendingTasks, dispatchGmailReminder } from '../../lib/reminderService';

interface GmailReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReplan?: () => void;
}

export const GmailReminderModal: React.FC<GmailReminderModalProps> = ({
  isOpen,
  onClose,
  onOpenReplan,
}) => {
  const { user, profile, isGuest } = useAuth();
  const { activePlan } = useData();

  const keyMoves = activePlan?.key_moves || [];
  const analysis = analyzePendingTasks(keyMoves, profile);

  const defaultEmail = isGuest ? 'demo@executive.io' : user?.email || '';
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCloudDispatch = async () => {
    if (!recipientEmail.trim()) {
      setError('Please provide a valid Gmail recipient address.');
      return;
    }

    setIsSending(true);
    setError(null);
    setSendSuccess(null);

    try {
      const res = await dispatchGmailReminder({
        recipientEmail: recipientEmail.trim(),
        userName: profile?.display_name || user?.user_metadata?.full_name || 'Executive',
        analysis,
        resendApiKey: profile?.preferences?.resend_api_key,
      });

      if (res.edgeFunctionResult?.emailDispatchResult?.sent) {
        setSendSuccess('Executive briefing delivered directly to your Gmail inbox!');
      } else {
        setSendSuccess(
          'Briefing generated and logged to Supabase! Click "Open in Gmail Web" below to send or view instantly.'
        );
      }
    } catch (err: any) {
      console.error('Dispatch error:', err);
      setError(err?.message || 'Failed to dispatch cloud reminder.');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenGmailWeb = async () => {
    const res = await dispatchGmailReminder({
      recipientEmail: recipientEmail.trim() || defaultEmail,
      userName: profile?.display_name || user?.user_metadata?.full_name || 'Executive',
      analysis,
    });
    window.open(res.gmailDraftUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="card-ceo bg-[#0e121a]/95 border border-white/[0.12] rounded-2xl max-w-xl w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Gmail Executive Reminder
                </h2>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full font-semibold">
                  {analysis.totalAlerts} Flagged Priorities
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Send an alert to Gmail for missed, forgotten, or time-constrained priorities.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sendSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200">{sendSuccess}</p>
                <p className="text-[11px] text-emerald-400/80 mt-1">
                  Includes a direct return button linking back to your Executive Command Center.
                </p>
              </div>
            </div>
          )}

          {/* Overview Metric Pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-[#141824] border border-white/[0.06]">
              <div className="text-rose-400 font-bold text-lg">{analysis.missedTasks.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Missed / Overdue</div>
            </div>
            <div className="p-3 rounded-xl bg-[#141824] border border-white/[0.06]">
              <div className="text-amber-400 font-bold text-lg">{analysis.atRiskTasks.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Time At-Risk</div>
            </div>
            <div className="p-3 rounded-xl bg-[#141824] border border-white/[0.06]">
              <div className="text-indigo-400 font-bold text-lg">{analysis.pendingTasks.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Active Pending</div>
            </div>
          </div>

          {/* Time Budget Alert Banner if Over Capacity */}
          {analysis.isOverCapacity && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300 block">Insufficient Time Remaining</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    You have <strong>{analysis.totalPendingMinutes} mins</strong> of pending work, but only{' '}
                    <strong>{analysis.remainingMinutesInWorkday} mins</strong> remain in your scheduled workday.
                  </p>
                </div>
              </div>
              {onOpenReplan && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenReplan();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold shrink-0 transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replan Day</span>
                </button>
              )}
            </div>
          )}

          {/* Recipient Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gmail Recipient Address
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g. executive@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 font-mono transition"
            />
          </div>

          {/* Flagged Task List Preview */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
              Flagged Priority Breakdown
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {analysis.missedTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{t.title}</span>
                    <span className="text-[10px] text-rose-300/80 font-mono">
                      Scheduled: {t.timeSlot || 'Earlier today'} • {t.estimatedMinutes}m
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-rose-500/15 border border-rose-500/30 text-rose-400">
                    Missed
                  </span>
                </div>
              ))}

              {analysis.atRiskTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{t.title}</span>
                    <span className="text-[10px] text-amber-300/80 font-mono">
                      {t.reason} • {t.estimatedMinutes}m
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    At Risk
                  </span>
                </div>
              ))}

              {analysis.pendingTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block">{t.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Priority {t.priority} • {t.estimatedMinutes}m
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                    Pending
                  </span>
                </div>
              ))}

              {analysis.totalAlerts === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-white/[0.08] text-center text-xs text-slate-400">
                  🎉 All scheduled priorities are complete or on track.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with 2 Dispatch Options */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-white/[0.01]">
          <button
            type="button"
            onClick={handleOpenGmailWeb}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Open pre-formatted draft in Gmail Web"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Open Draft in Gmail Web</span>
          </button>

          <button
            type="button"
            onClick={handleCloudDispatch}
            disabled={isSending || analysis.totalAlerts === 0}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer transition active:scale-95 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Gmail Reminder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
