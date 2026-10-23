import { z } from 'zod';

export const MoodSchema = z.enum(['energized', 'focused', 'neutral', 'stressed', 'tired']);

export const CheckInFormSchema = z.object({
  energy: z.number().int().min(1).max(10),
  mood: MoodSchema,
  main_goal: z.string().trim().min(3, 'Please describe your main goal in at least 3 characters').max(300),
  obstacles: z.string().trim().max(500).optional().nullable(),
  available_minutes: z.number().int().min(10, 'Must provide at least 10 minutes').max(1440),
  urgent_commitments: z.string().trim().max(500).optional().nullable(),
});

export const KeyMoveOutputSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(400),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  estimatedMinutes: z.number().int().min(5).max(720),
  completionCriteria: z.string().trim().min(3).max(250),
});

export const AIDailyPlanOutputSchema = z.object({
  primaryMission: z.object({
    title: z.string().trim().min(3).max(150),
    why: z.string().trim().min(5).max(300),
    successCriteria: z.string().trim().min(5).max(250),
    estimatedMinutes: z.number().int().min(10).max(720),
  }),
  keyMoves: z.array(KeyMoveOutputSchema).min(1).max(3),
  decisionFilter: z.object({
    if: z.string().trim().min(5).max(250),
    then: z.string().trim().min(5).max(250),
    ignoreOrDefer: z.string().trim().min(5).max(250),
  }),
  energyAdvice: z.string().trim().min(5).max(400),
  shutdownRitual: z.array(z.string().trim().min(3).max(150)).min(1).max(5),
  assumptions: z.array(z.string().trim().min(3).max(150)).optional(),
});

export const AIReflectionOutputSchema = z.object({
  summary: z.string().trim().min(5).max(400),
  observations: z.array(z.string().trim().min(3).max(250)).min(1).max(3),
  lesson: z.string().trim().min(5).max(300),
  nextAction: z.string().trim().min(5).max(250),
});

export const ReplanInputSchema = z.object({
  changeReason: z.string().trim().min(3, 'Please describe what changed').max(300),
  remainingMinutes: z.number().int().min(5).max(1440),
  newEnergy: z.number().int().min(1).max(10).optional(),
});
