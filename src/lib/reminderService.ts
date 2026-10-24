import { supabase } from './supabase';
import type { KeyMove, Profile } from '../types';

export interface TaskAlertAnalysis {
  missedTasks: Array<{
    id: string;
    title: string;
    timeSlot?: string;
    priority: number;
    estimatedMinutes: number;
  }>;
  atRiskTasks: Array<{
    id: string;
    title: string;
    timeSlot?: string;
    priority: number;
    estimatedMinutes: number;
    reason: string;
  }>;
  pendingTasks: Array<{
    id: string;
    title: string;
    timeSlot?: string;
    priority: number;
    estimatedMinutes: number;
  }>;
  totalAlerts: number;
  remainingMinutesInWorkday: number;
  totalPendingMinutes: number;
  isOverCapacity: boolean;
}

export function parseTimeSlot(slotStr?: string): { startMinutes: number; endMinutes: number } | null {
  if (!slotStr) return null;
  const matches = [...slotStr.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  if (matches.length < 1) return null;

  const parseMatch = (m: RegExpMatchArray) => {
    let hour = parseInt(m[1], 10);
    const minute = m[2] ? parseInt(m[2], 10) : 0;
    const meridian = m[3].toUpperCase();
    if (meridian === 'PM' && hour !== 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  const startMinutes = parseMatch(matches[0]);
  const endMinutes = matches.length > 1 ? parseMatch(matches[1]) : startMinutes + 60;
  return { startMinutes, endMinutes };
}

export function analyzePendingTasks(
  keyMoves: KeyMove[],
  profile?: Profile | null
): TaskAlertAnalysis {
  const now = new Date();
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();

  const workEndHour = profile?.preferences?.work_end_hour ?? 18; // default 6:00 PM
  const workEndMinutes = workEndHour * 60;
  const remainingMinutesInWorkday = Math.max(0, workEndMinutes - currentMinutesFromMidnight);

  const pendingMoves = keyMoves.filter((m) => m.status !== 'completed');
  const missedTasks: TaskAlertAnalysis['missedTasks'] = [];
  const atRiskTasks: TaskAlertAnalysis['atRiskTasks'] = [];
  const normalPending: TaskAlertAnalysis['pendingTasks'] = [];

  let accumulatedPendingMinutes = 0;

  pendingMoves.forEach((move) => {
    const duration = move.estimated_minutes || 45;
    accumulatedPendingMinutes += duration;
    const slot = parseTimeSlot(move.completionCriteria);

    if (slot && slot.endMinutes < currentMinutesFromMidnight) {
      // Scheduled slot has already passed
      missedTasks.push({
        id: move.id,
        title: move.title,
        timeSlot: move.completionCriteria,
        priority: move.priority || 2,
        estimatedMinutes: duration,
      });
    } else if (accumulatedPendingMinutes > remainingMinutesInWorkday && remainingMinutesInWorkday > 0) {
      // Not enough time left in the executive workday to complete this task
      atRiskTasks.push({
        id: move.id,
        title: move.title,
        timeSlot: move.completionCriteria,
        priority: move.priority || 2,
        estimatedMinutes: duration,
        reason: `Exceeds remaining workday window by ${accumulatedPendingMinutes - remainingMinutesInWorkday} mins`,
      });
    } else if (remainingMinutesInWorkday <= 30 && duration > 30) {
      // Workday closing in < 30 minutes
      atRiskTasks.push({
        id: move.id,
        title: move.title,
        timeSlot: move.completionCriteria,
        priority: move.priority || 2,
        estimatedMinutes: duration,
        reason: 'Workday ends in less than 30 minutes',
      });
    } else {
      normalPending.push({
        id: move.id,
        title: move.title,
        timeSlot: move.completionCriteria,
        priority: move.priority || 2,
        estimatedMinutes: duration,
      });
    }
  });

  return {
    missedTasks,
    atRiskTasks,
    pendingTasks: normalPending,
    totalAlerts: missedTasks.length + atRiskTasks.length + normalPending.length,
    remainingMinutesInWorkday,
    totalPendingMinutes: accumulatedPendingMinutes,
    isOverCapacity: accumulatedPendingMinutes > remainingMinutesInWorkday && remainingMinutesInWorkday > 0,
  };
}

export interface DispatchReminderOptions {
  recipientEmail: string;
  userName?: string;
  appUrl?: string;
  analysis: TaskAlertAnalysis;
  resendApiKey?: string;
}

export async function dispatchGmailReminder(options: DispatchReminderOptions): Promise<{
  success: boolean;
  subject: string;
  gmailDraftUrl: string;
  edgeFunctionResult?: any;
  error?: string;
}> {
  const { recipientEmail, userName = 'Executive', appUrl = window.location.origin, analysis, resendApiKey } = options;

  const totalAlerts = analysis.totalAlerts;
  const subject = `🚨 [The Daily CEO] Alert: ${totalAlerts} Pending Priorities Need Your Attention`;

  // Build clean text version for Gmail Compose link
  const textLines = [
    `Chief of Staff Briefing for ${userName}`,
    `========================================`,
    `You have ${totalAlerts} pending priority focus blocks today.`,
    '',
  ];

  if (analysis.missedTasks.length > 0) {
    textLines.push(`🛑 MISSED / OVERDUE FOCUS BLOCKS (${analysis.missedTasks.length}):`);
    analysis.missedTasks.forEach((t) => {
      textLines.push(`  • ${t.title} [${t.timeSlot || 'Scheduled earlier'} - ${t.estimatedMinutes}m]`);
    });
    textLines.push('');
  }

  if (analysis.atRiskTasks.length > 0) {
    textLines.push(`⏳ TIME CONSTRAINED / AT RISK (${analysis.atRiskTasks.length}):`);
    analysis.atRiskTasks.forEach((t) => {
      textLines.push(`  • ${t.title} [${t.estimatedMinutes}m - ${t.reason}]`);
    });
    textLines.push('');
  }

  if (analysis.pendingTasks.length > 0) {
    textLines.push(`📋 ACTIVE PENDING PRIORITIES (${analysis.pendingTasks.length}):`);
    analysis.pendingTasks.forEach((t) => {
      textLines.push(`  • ${t.title} (Priority ${t.priority} • ${t.estimatedMinutes}m)`);
    });
    textLines.push('');
  }

  textLines.push(`👉 RETURN TO EXECUTIVE COMMAND CENTER:`);
  textLines.push(`${appUrl}`);
  textLines.push('');
  textLines.push(`Recommendation: Trigger mid-day Replan or delegate secondary tasks to protect cognitive energy.`);

  const textBody = textLines.join('\n');

  // Direct 1-Click Gmail Web Draft URL (works 100% reliably in any browser)
  const gmailDraftUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipientEmail
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;

  let edgeFunctionResult = null;

  // Attempt Cloud Edge Function Dispatch
  try {
    const edgeFunctionUrl = 'https://fsqcyxogerxutdyvgwhw.supabase.co/functions/v1/send-task-reminder';
    const res = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail,
        userName,
        appUrl,
        missedTasks: analysis.missedTasks,
        pendingTasks: analysis.pendingTasks,
        atRiskTasks: analysis.atRiskTasks,
        resendApiKey,
      }),
    });

    if (res.ok) {
      edgeFunctionResult = await res.json();
    }
  } catch (err: any) {
    console.warn('Edge function dispatch notification error:', err);
  }

  // Log to Supabase reminder_logs
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      await supabase.from('reminder_logs').insert({
        user_id: authData.user.id,
        recipient_email: recipientEmail,
        subject,
        missed_count: analysis.missedTasks.length,
        pending_count: analysis.pendingTasks.length,
        at_risk_count: analysis.atRiskTasks.length,
        status: edgeFunctionResult?.emailDispatchResult?.sent ? 'delivered' : 'generated',
      });
    }
  } catch (_e) {
    // Ignore logging failures
  }

  return {
    success: true,
    subject,
    gmailDraftUrl,
    edgeFunctionResult,
  };
}
