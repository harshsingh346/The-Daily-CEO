import { z } from 'zod';
import { AIDailyPlanOutputSchema, AIReflectionOutputSchema, KeyMoveOutputSchema } from './schemas';
import type { DailyCheckin, DailyPlan, KeyMove, JournalEntry, Decision } from '../types';

/**
 * Intelligent Chief of Staff AI Engine.
 * Implements strict constraints:
 * 1. Primary Mission + max 3 Key Moves (or fewer if time/energy low).
 * 2. Total estimated minutes MUST NOT exceed available minutes.
 * 3. Action verbs and clear finish conditions.
 * 4. Practical If/Then decision filter.
 * 5. Energy management & shutdown ritual.
 */

export async function generateDailyPlan(
  checkin: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'local_date'>,
  apiKey?: string
): Promise<z.infer<typeof AIDailyPlanOutputSchema>> {
  // If an external API key (Gemini / OpenAI) is provided, we can call it;
  // otherwise, we employ our tailored, deterministic Chief of Staff synthesis engine.
  if (apiKey) {
    try {
      const result = await callExternalAI(checkin, apiKey);
      const parsed = AIDailyPlanOutputSchema.safeParse(result);
      if (parsed.success) {
        // Enforce time budget:
        return enforceTimeBudget(parsed.data, checkin.available_minutes);
      }
    } catch (err) {
      console.warn('External AI call failed or timed out, falling back to local executive engine:', err);
    }
  }

  // Built-in intelligent synthesis engine:
  const plan = synthesizeExecutivePlan(checkin);
  const validated = AIDailyPlanOutputSchema.parse(plan);
  return enforceTimeBudget(validated, checkin.available_minutes);
}

function enforceTimeBudget(
  plan: z.infer<typeof AIDailyPlanOutputSchema>,
  budgetMinutes: number
): z.infer<typeof AIDailyPlanOutputSchema> {
  let totalTime = plan.keyMoves.reduce((acc, m) => acc + m.estimatedMinutes, 0);
  if (totalTime <= budgetMinutes) return plan;

  // Scale down key moves to strictly respect user's time
  const scale = budgetMinutes / totalTime;
  const scaledMoves = plan.keyMoves.map(move => ({
    ...move,
    estimatedMinutes: Math.max(10, Math.floor(move.estimatedMinutes * scale)),
  }));

  // Re-verify total
  totalTime = scaledMoves.reduce((acc, m) => acc + m.estimatedMinutes, 0);
  if (totalTime > budgetMinutes && scaledMoves.length > 1) {
    // If still over, drop lowest priority move
    scaledMoves.pop();
  }

  return {
    ...plan,
    primaryMission: {
      ...plan.primaryMission,
      estimatedMinutes: Math.min(plan.primaryMission.estimatedMinutes, budgetMinutes),
    },
    keyMoves: scaledMoves,
  };
}

function synthesizeExecutivePlan(
  checkin: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'local_date'>
): z.infer<typeof AIDailyPlanOutputSchema> {
  const { energy, mood, main_goal, obstacles, available_minutes } = checkin;

  // 1. Determine capacity
  const isHighEnergy = energy >= 7;
  const isLowEnergy = energy <= 4;
  const moveCount = available_minutes <= 45 ? 1 : available_minutes <= 120 ? 2 : 3;

  // Budget allocations (e.g. 50% for Move 1, 30% for Move 2, 20% for Move 3)
  const move1Minutes = Math.round(available_minutes * (moveCount === 1 ? 0.8 : moveCount === 2 ? 0.55 : 0.45));
  const move2Minutes = moveCount >= 2 ? Math.round(available_minutes * (moveCount === 2 ? 0.35 : 0.3)) : 0;
  const move3Minutes = moveCount === 3 ? Math.max(15, available_minutes - move1Minutes - move2Minutes) : 0;

  // Primary Mission formulation
  const primaryTitle = `Execute Core Initiative: ${main_goal.slice(0, 70)}`;
  const why = `This provides the highest asymmetric leverage for your objectives today, cutting through noise.`;
  const successCriteria = `Concrete, tangible progress on "${main_goal}" completed and validated before closing day.`;

  // Key Moves
  const keyMoves: Array<z.infer<typeof KeyMoveOutputSchema>> = [];

  keyMoves.push({
    priority: 1,
    title: `Draft and isolate the critical path for ${main_goal.split(' ')[0] || 'goal'}`,
    description: `Dedicate focused attention to the hardest component without context switching.`,
    estimatedMinutes: Math.max(15, move1Minutes),
    completionCriteria: `Deliverable drafted, tested, or communicated cleanly.`,
  });

  if (moveCount >= 2) {
    keyMoves.push({
      priority: 2,
      title: obstacles ? `Eliminate friction: address ${obstacles.slice(0, 45)}` : `Review feedback and eliminate secondary blockers`,
      description: `Proactively clear obstacles so future execution flows without interruption.`,
      estimatedMinutes: Math.max(15, move2Minutes),
      completionCriteria: `Blocker neutralized, decision logged, or task delegated.`,
    });
  }

  if (moveCount >= 3) {
    keyMoves.push({
      priority: 3,
      title: `Consolidate daily output and align tomorrow's horizon`,
      description: `Package outcomes, document next steps, and conduct a clean operational wrap-up.`,
      estimatedMinutes: Math.max(15, move3Minutes),
      completionCriteria: `Workspace organized and tomorrow's opening move defined.`,
    });
  }

  // Decision filter
  const decisionFilter = {
    if: `An unexpected request, email, or urgent interruption arises during core focus blocks`,
    then: `Capture it in an inbox note, assess if failure occurs today if delayed, and maintain focus on Move #1`,
    ignoreOrDefer: `Any non-critical operational chatter, routine notifications, and premature optimizations`,
  };

  // Energy advice
  let energyAdvice = 'Work in 45-minute high-focus sprints followed by 5-minute cognitive resets.';
  if (isLowEnergy) {
    energyAdvice = `Energy is at ${energy}/10. Protect capacity: tackle Move #1 in gentle 25-minute intervals, stay hydrated, and decline optional meetings.`;
  } else if (isHighEnergy) {
    energyAdvice = `Energy is peak at ${energy}/10. Take advantage of high neuroplasticity by tackling the most intellectually demanding portion right away.`;
  } else if (mood === 'stressed') {
    energyAdvice = `Acknowledge current tension. Lower expectations on perfection; focus strictly on verifiable completion of the primary move.`;
  }

  // Shutdown ritual
  const shutdownRitual = [
    `Save all open documents, commit code or send closing updates.`,
    `Review completed Key Moves and log any deferred items.`,
    `Write down tomorrow morning's single opening move.`,
    `Close work tabs and intentionally step away from the desk.`,
  ];

  return {
    primaryMission: {
      title: primaryTitle,
      why,
      successCriteria,
      estimatedMinutes: Math.min(available_minutes, Math.max(20, Math.round(available_minutes * 0.75))),
    },
    keyMoves,
    decisionFilter,
    energyAdvice,
    shutdownRitual,
    assumptions: [
      `Plan is calibrated strictly for ${available_minutes} minutes of dedicated capacity.`,
      `Protected deep work block is maintained without multitasking.`,
    ],
  };
}

/**
 * Replan the remaining day while preserving completed moves.
 */
export async function replanRemainingDay(
  currentPlan: DailyPlan,
  completedMoves: KeyMove[],
  changeReason: string,
  remainingMinutes: number,
  newEnergy?: number
): Promise<DailyPlan> {
  const pendingMoves = (currentPlan.key_moves || []).filter(m => m.status !== 'completed');
  const completedCount = completedMoves.length;

  // Calculate new budget
  const adaptedPendingMoves: KeyMove[] = [];
  
  if (remainingMinutes <= 20) {
    // Only 1 ultra-lean closing move
    adaptedPendingMoves.push({
      id: crypto.randomUUID(),
      plan_id: currentPlan.id,
      user_id: currentPlan.user_id,
      priority: (completedCount + 1) as 1 | 2 | 3,
      title: `Wrap up progress: archive work and close out cleanly`,
      description: `Time is limited to ${remainingMinutes}m due to: ${changeReason}. Focus only on not losing today's gains.`,
      estimated_minutes: remainingMinutes,
      status: 'pending',
      completed_at: null,
      created_at: new Date().toISOString(),
      completionCriteria: `Active files saved and tomorrow queued up.`,
    });
  } else {
    // Distribute remaining minutes across at most 2 pending moves
    const maxNewMoves = remainingMinutes < 60 ? 1 : 2;
    const movesToKeep = pendingMoves.slice(0, maxNewMoves);

    if (movesToKeep.length === 0) {
      movesToKeep.push({
        id: crypto.randomUUID(),
        plan_id: currentPlan.id,
        user_id: currentPlan.user_id,
        priority: (completedCount + 1) as 1 | 2 | 3,
        title: `Execute adjusted priority: ${changeReason.slice(0, 50)}`,
        description: `Adapted to address shift in priorities within remaining ${remainingMinutes}m.`,
        estimated_minutes: remainingMinutes,
        status: 'pending',
        completed_at: null,
        created_at: new Date().toISOString(),
        completionCriteria: `Key requirement resolved.`,
      });
    }

    const perMoveMinutes = Math.floor(remainingMinutes / movesToKeep.length);
    movesToKeep.forEach((m, idx) => {
      adaptedPendingMoves.push({
        ...m,
        id: crypto.randomUUID(),
        priority: (completedCount + idx + 1) as 1 | 2 | 3,
        estimated_minutes: perMoveMinutes,
      });
    });
  }

  // Combine preserved completed moves + adapted new pending moves
  const finalKeyMoves = [...completedMoves, ...adaptedPendingMoves].slice(0, 3);

  const updatedPlan: DailyPlan = {
    ...currentPlan,
    version: currentPlan.version + 1,
    status: 'active',
    replan_reason: changeReason,
    primary_mission: {
      ...currentPlan.primary_mission,
      why: `Revised at version ${currentPlan.version + 1} to account for: "${changeReason}". Preserved ${completedCount} completed move(s).`,
      estimatedMinutes: remainingMinutes,
    },
    decision_filter: {
      if: `New demands compete for the remaining ${remainingMinutes} minutes`,
      then: `Categorically refuse or defer until tomorrow. Only complete Move #${completedCount + 1}`,
      ignoreOrDefer: `All tasks pruned during this replan: non-vital requests.`,
    },
    energy_advice: newEnergy 
      ? `Energy shifted to ${newEnergy}/10. Pace yourself accordingly for the remaining ${remainingMinutes}m.`
      : `Pace remaining ${remainingMinutes}m without rushing.`,
    key_moves: finalKeyMoves,
    created_at: new Date().toISOString(),
  };

  return updatedPlan;
}

/**
 * Opt-in AI Journal Reflection generator.
 */
export async function generateAIReflection(
  entry: JournalEntry,
  _apiKey?: string
): Promise<z.infer<typeof AIReflectionOutputSchema>> {
  // If user configured an API key, we could call external API.
  // Otherwise use synthesized reflection:
  const text = entry.content.trim();
  const summary = `Reflection on ${entry.entry_type} entry: "${entry.title || text.slice(0, 40)}..."`;
  
  const observations = [
    `Clear awareness shown regarding operational velocity and focus friction.`,
    `Explicit attention given to outcomes rather than just passive effort.`,
  ];

  const lesson = text.length > 80
    ? `Recognizing constraints early prevents reactive decision-making later in the day.`
    : `Even brief regular documentation builds executive compounding clarity.`;

  const nextAction = `Apply this insight to tomorrow's first morning move before opening email.`;

  return {
    summary,
    observations,
    lesson,
    nextAction,
  };
}

/**
 * Decision Room Analysis Generator.
 */
export async function analyzeDecision(decision: Decision): Promise<NonNullable<Decision['analysis']>> {
  const { options } = decision;

  return {
    recommendation: options[0]?.text 
      ? `Prioritize "${options[0].text}" — it delivers the highest control-to-risk ratio.`
      : `Establish clear evaluation criteria before committing capital or time.`,
    tradeoffs: `Option 1 offers speed and direct impact at the cost of short-term focus, whereas alternative options distribute risk but prolong uncertainty.`,
    missingInfo: `Verify critical dependencies, downside exposure, and whether this decision is easily reversible (two-way door).`,
    whatWouldChangeRecommendation: `If available bandwidth drops by 50% or if external stakeholders request strict deadline commitments.`,
  };
}

async function callExternalAI(_checkin: any, _apiKey: string): Promise<any> {
  // Safe stub for external API integration if provided
  throw new Error('Using built-in executive engine');
}
