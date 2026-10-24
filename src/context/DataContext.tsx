import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getTodayLocalDate } from '../lib/dates';
import { generateDailyPlan, replanRemainingDay, generateAIReflection, analyzeDecision } from '../lib/aiEngine';
import {
  SAMPLE_PLAN,
  SAMPLE_CHECKIN,
  SAMPLE_GOALS,
  SAMPLE_JOURNAL_ENTRIES,
  SAMPLE_REVIEWS,
  SAMPLE_DECISIONS,
  SAMPLE_PROJECTS,
} from '../lib/sampleData';
import type {
  DailyCheckin,
  DailyPlan,
  KeyMove,
  Goal,
  JournalEntry,
  DailyReview,
  Decision,
  JournalEntryType,
  Project,
} from '../types';

interface DataContextType {
  todayDate: string;
  checkin: DailyCheckin | null;
  activePlan: DailyPlan | null;
  planHistory: DailyPlan[];
  goals: Goal[];
  projects: Project[];
  journalEntries: JournalEntry[];
  reviews: DailyReview[];
  decisions: Decision[];
  isLoading: boolean;
  isGeneratingPlan: boolean;
  submitCheckin: (checkinData: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'local_date'>) => Promise<DailyPlan>;
  toggleKeyMove: (moveId: string) => Promise<void>;
  executeReplan: (changeReason: string, remainingMinutes: number, newEnergy?: number) => Promise<DailyPlan>;
  addGoal: (title: string, description?: string, targetDate?: string) => Promise<void>;
  updateGoalStatus: (goalId: string, status: Goal['status']) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  addProject: (title: string, description: string, priority: Project['priority'], targetDate?: string, initialTasks?: string[]) => Promise<void>;
  toggleProjectTask: (projectId: string, taskId: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: Project['status']) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addJournalEntry: (type: JournalEntryType, content: string, title?: string, mood?: string) => Promise<JournalEntry>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  generateJournalReflection: (entryId: string) => Promise<void>;
  submitEveningReview: (review: Omit<DailyReview, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'local_date'>) => Promise<void>;
  addDecision: (question: string, options: { id: string; text: string; pros: string[]; cons: string[] }[]) => Promise<Decision>;
  updateDecisionChoice: (decisionId: string, chosenOption: string) => Promise<void>;
  resetToSampleData: () => void;
  clearAllUserData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const todayDate = getTodayLocalDate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  const [checkin, setCheckin] = useState<DailyCheckin | null>(null);
  const [activePlan, setActivePlan] = useState<DailyPlan | null>(null);
  const [planHistory, setPlanHistory] = useState<DailyPlan[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reviews, setReviews] = useState<DailyReview[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  // Load state from Supabase or LocalStorage cache
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isGuest || !user) {
        // Load demo cache
        const localCheckin = localStorage.getItem('ceo_checkin');
        const localPlan = localStorage.getItem('ceo_plan');
        const localHistory = localStorage.getItem('ceo_plan_history');
        const localGoals = localStorage.getItem('ceo_goals');
        const localProjects = localStorage.getItem('ceo_projects');
        const localJournal = localStorage.getItem('ceo_journal');
        const localReviews = localStorage.getItem('ceo_reviews');
        const localDecisions = localStorage.getItem('ceo_decisions');

        setCheckin(localCheckin ? JSON.parse(localCheckin) : SAMPLE_CHECKIN);
        setActivePlan(localPlan ? JSON.parse(localPlan) : SAMPLE_PLAN);
        setPlanHistory(localHistory ? JSON.parse(localHistory) : [SAMPLE_PLAN]);
        setGoals(localGoals ? JSON.parse(localGoals) : SAMPLE_GOALS);
        setProjects(localProjects ? JSON.parse(localProjects) : SAMPLE_PROJECTS);
        setJournalEntries(localJournal ? JSON.parse(localJournal) : SAMPLE_JOURNAL_ENTRIES);
        setReviews(localReviews ? JSON.parse(localReviews) : SAMPLE_REVIEWS);
        setDecisions(localDecisions ? JSON.parse(localDecisions) : SAMPLE_DECISIONS);
      } else {
        // Authenticated Supabase user:
        const [
          { data: checkinData },
          { data: plansData },
          { data: goalsData },
          { data: projectsData },
          { data: journalData },
          { data: reviewsData },
          { data: decisionsData },
        ] = await Promise.all([
          supabase.from('daily_checkins').select('*').eq('local_date', todayDate).maybeSingle(),
          supabase.from('daily_plans').select('*, key_moves(*)').order('created_at', { ascending: false }),
          supabase.from('goals').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('journal_entries').select('*').order('created_at', { ascending: false }),
          supabase.from('daily_reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('decisions').select('*').order('created_at', { ascending: false }),
        ]);

        let finalCheckin = checkinData ? (checkinData as DailyCheckin) : null;
        let finalPlans = plansData && plansData.length > 0 ? (plansData as unknown as DailyPlan[]) : [];
        let finalGoals = goalsData ? (goalsData as Goal[]) : [];
        let finalProjects = projectsData ? (projectsData as Project[]) : [];
        let finalJournal = journalData ? (journalData as JournalEntry[]) : [];
        let finalReviews = reviewsData ? (reviewsData as DailyReview[]) : [];
        let finalDecisions = decisionsData ? (decisionsData as Decision[]) : [];

        // If fresh account with no plans and no goals, seed initial executive suite for this user in Supabase:
        if (finalPlans.length === 0 && finalGoals.length === 0 && user) {
          const now = new Date().toISOString();
          const userId = user.id;

          // 1. Initial Checkin for today
          const seededCheckin: DailyCheckin = {
            id: crypto.randomUUID(),
            user_id: userId,
            local_date: todayDate,
            energy: 9,
            mood: 'energized',
            main_goal: 'Execute core quarterly objectives and lead key initiatives with high clarity',
            obstacles: 'Context switching and unstructured meetings',
            available_minutes: 360,
            urgent_commitments: 'Board review preparation and strategic roadmap alignment',
            created_at: now,
            updated_at: now,
          };
          await supabase.from('daily_checkins').upsert(seededCheckin);
          finalCheckin = seededCheckin;

          // 2. Initial Plan & Key Moves
          const initialPlanId = crypto.randomUUID();
          const seededPlan: DailyPlan = {
            id: initialPlanId,
            user_id: userId,
            checkin_id: seededCheckin.id,
            local_date: todayDate,
            version: 1,
            status: 'active',
            primary_mission: {
              title: 'Drive decisive progress on high-leverage revenue initiatives.',
              why: 'Unlocks milestone achievement for Q4 and keeps team synchronized on priority one.',
              successCriteria: 'Review dashboard metrics and execute all 3 priority key moves.',
              estimatedMinutes: 90,
            },
            decision_filter: {
              if: 'an incoming initiative does not directly impact Q4 velocity or customer retention',
              then: 'delegate or defer to next cycle',
              ignoreOrDefer: 'unstructured meeting requests and minor scope creep',
            },
            energy_advice: 'Peak energy window is 9:00 AM – 12:30 PM. Protect this block for deep strategic execution.',
            shutdown_ritual: [
              'Review today’s completed moves and update KPI metrics',
              'Capture quick evening reflection or lessons learned',
              'Define top 3 priorities for tomorrow morning',
            ],
            created_at: now,
            key_moves: [
              {
                id: crypto.randomUUID(),
                plan_id: initialPlanId,
                user_id: userId,
                title: 'Review Q4 Strategic Priorities & Revenue Engine',
                description: 'Verify quarterly milestones and ensure resources are aligned to top deliverables.',
                priority: 1,
                estimated_minutes: 60,
                status: 'pending',
                completed_at: null,
                created_at: now,
              },
              {
                id: crypto.randomUUID(),
                plan_id: initialPlanId,
                user_id: userId,
                title: 'Executive Sync with Core Leadership Team',
                description: 'Align on blockers, resource allocation, and key deliverables for the week.',
                priority: 2,
                estimated_minutes: 45,
                status: 'pending',
                completed_at: null,
                created_at: now,
              },
              {
                id: crypto.randomUUID(),
                plan_id: initialPlanId,
                user_id: userId,
                title: 'Decision Room: Evaluate Strategic Partnership Opportunity',
                description: 'Run 5-filter CEO framework on incoming commercial partnership proposal.',
                priority: 3,
                estimated_minutes: 30,
                status: 'pending',
                completed_at: null,
                created_at: now,
              },
            ],
          };

          const { key_moves, ...planRecord } = seededPlan;
          await supabase.from('daily_plans').insert(planRecord);
          if (key_moves && key_moves.length > 0) {
            await supabase.from('key_moves').insert(key_moves);
          }
          finalPlans = [seededPlan];

          // 3. Initial Goals
          const seededGoals: Goal[] = [
            {
              id: crypto.randomUUID(),
              user_id: userId,
              title: 'Achieve 35% QoQ Expansion in Recurring Enterprise ARR',
              description: 'Focus on high-value client acquisition and expanding key accounts.',
              target_date: '2026-12-31',
              status: 'active',
              created_at: now,
            },
            {
              id: crypto.randomUUID(),
              user_id: userId,
              title: 'Scale High-Performance Product Leadership & Operations',
              description: 'Attract top-tier talent and streamline cross-functional velocity.',
              target_date: '2026-11-30',
              status: 'active',
              created_at: now,
            },
            {
              id: crypto.randomUUID(),
              user_id: userId,
              title: 'Maintain 80%+ Deep Work Adherence and Zero Executive Burnout',
              description: 'Protect mornings for strategic thinking and maintain healthy evening shutdowns.',
              target_date: '2026-12-31',
              status: 'active',
              created_at: now,
            },
          ];
          await supabase.from('goals').insert(seededGoals);
          finalGoals = seededGoals;

          // 4. Initial Projects
          const seededProjects: Project[] = [
            {
              id: crypto.randomUUID(),
              user_id: userId,
              title: 'Executive Operating System Upgrade',
              description: 'Implement real-time KPI tracking, daily briefing loops, and strategic replanning.',
              status: 'active',
              priority: 'critical',
              target_date: '2026-11-15',
              created_at: now,
              tasks: [
                { id: crypto.randomUUID(), title: 'Configure Supabase real-time cloud database', completed: true },
                { id: crypto.randomUUID(), title: 'Implement daily check-in & AI briefing engine', completed: true },
                { id: crypto.randomUUID(), title: 'Review weekly velocity and decision log', completed: false },
              ],
            },
            {
              id: crypto.randomUUID(),
              user_id: userId,
              title: 'Enterprise Growth & Strategic Partnerships',
              description: 'Identify top 5 strategic partners and establish recurring distribution channels.',
              status: 'active',
              priority: 'high',
              target_date: '2026-12-15',
              created_at: now,
              tasks: [
                { id: crypto.randomUUID(), title: 'Prepare partnership pitch deck', completed: true },
                { id: crypto.randomUUID(), title: 'Schedule initial leadership exploratory calls', completed: false },
                { id: crypto.randomUUID(), title: 'Finalize memorandum of understanding', completed: false },
              ],
            },
          ];
          await supabase.from('projects').insert(seededProjects);
          finalProjects = seededProjects;
        }

        setCheckin(finalCheckin);

        if (finalPlans.length > 0) {
          // Sort key moves by priority
          finalPlans.forEach(p => {
            if (p.key_moves) {
              p.key_moves.sort((a, b) => a.priority - b.priority);
            }
          });
          const todayActive = finalPlans.find(p => p.local_date === todayDate && p.status === 'active') || finalPlans[0];
          setActivePlan(todayActive || null);
          setPlanHistory(finalPlans);
        } else {
          setActivePlan(null);
          setPlanHistory([]);
        }

        setGoals(finalGoals);
        setProjects(finalProjects);
        setJournalEntries(finalJournal);
        setReviews(finalReviews);
        setDecisions(finalDecisions);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isGuest, user, todayDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Synchronize localStorage when guest state updates
  useEffect(() => {
    if (isGuest) {
      if (checkin) localStorage.setItem('ceo_checkin', JSON.stringify(checkin));
      if (activePlan) localStorage.setItem('ceo_plan', JSON.stringify(activePlan));
      localStorage.setItem('ceo_plan_history', JSON.stringify(planHistory));
      localStorage.setItem('ceo_goals', JSON.stringify(goals));
      localStorage.setItem('ceo_projects', JSON.stringify(projects));
      localStorage.setItem('ceo_journal', JSON.stringify(journalEntries));
      localStorage.setItem('ceo_reviews', JSON.stringify(reviews));
      localStorage.setItem('ceo_decisions', JSON.stringify(decisions));
    }
  }, [isGuest, checkin, activePlan, planHistory, goals, projects, journalEntries, reviews, decisions]);

  // 1. Submit Daily Check-in and generate strategic plan
  const submitCheckin = async (
    checkinData: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'local_date'>
  ): Promise<DailyPlan> => {
    setIsGeneratingPlan(true);
    const userId = user?.id || 'sample-user';
    const now = new Date().toISOString();

    try {
      const fullCheckin: DailyCheckin = {
        id: crypto.randomUUID(),
        user_id: userId,
        local_date: todayDate,
        ...checkinData,
        created_at: now,
        updated_at: now,
      };

      // Generate AI Plan
      const generated = await generateDailyPlan(checkinData);

      const newPlanId = crypto.randomUUID();
      const newPlan: DailyPlan = {
        id: newPlanId,
        user_id: userId,
        checkin_id: fullCheckin.id,
        local_date: todayDate,
        version: 1,
        status: 'active',
        primary_mission: generated.primaryMission,
        decision_filter: generated.decisionFilter,
        energy_advice: generated.energyAdvice,
        shutdown_ritual: generated.shutdownRitual,
        created_at: now,
        key_moves: generated.keyMoves.map((m) => ({
          id: crypto.randomUUID(),
          plan_id: newPlanId,
          user_id: userId,
          title: m.title,
          description: m.description,
          priority: m.priority,
          estimated_minutes: m.estimatedMinutes,
          status: 'pending',
          completed_at: null,
          created_at: now,
          completionCriteria: m.completionCriteria,
        })),
      };

      if (!isGuest && user) {
        // Save checkin in Supabase
        await supabase.from('daily_checkins').upsert(fullCheckin);

        // Save plan in Supabase
        const { key_moves, ...planRecord } = newPlan;
        await supabase.from('daily_plans').insert(planRecord);

        // Save key moves
        if (key_moves && key_moves.length > 0) {
          await supabase.from('key_moves').insert(key_moves);
        }
      }

      setCheckin(fullCheckin);
      setActivePlan(newPlan);
      setPlanHistory((prev) => [newPlan, ...prev]);

      return newPlan;
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // 2. Toggle Key Move completion
  const toggleKeyMove = async (moveId: string) => {
    if (!activePlan || !activePlan.key_moves) return;

    const targetMove = activePlan.key_moves.find((m) => m.id === moveId);
    if (!targetMove) return;

    const newStatus: KeyMove['status'] = targetMove.status === 'completed' ? 'pending' : 'completed';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

    const updatedMoves = activePlan.key_moves.map((m) =>
      m.id === moveId ? { ...m, status: newStatus, completed_at: completedAt } : m
    );

    const updatedPlan: DailyPlan = {
      ...activePlan,
      key_moves: updatedMoves,
    };

    setActivePlan(updatedPlan);
    setPlanHistory((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));

    // Confetti celebration if completed!
    if (newStatus === 'completed') {
      const allCompleted = updatedMoves.every((m) => m.status === 'completed');
      confetti({
        particleCount: allCompleted ? 120 : 50,
        spread: allCompleted ? 90 : 60,
        origin: { y: 0.65 },
        colors: ['#6366f1', '#818cf8', '#a855f7', '#38bdf8'],
      });
    }

    if (!isGuest && user) {
      await supabase
        .from('key_moves')
        .update({ status: newStatus, completed_at: completedAt })
        .eq('id', moveId);
    }
  };

  // 3. Replan Mode
  const executeReplan = async (
    changeReason: string,
    remainingMinutes: number,
    newEnergy?: number
  ): Promise<DailyPlan> => {
    if (!activePlan) throw new Error('No active plan to replan');

    const completedMoves = (activePlan.key_moves || []).filter((m) => m.status === 'completed');
    const newVersion = await replanRemainingDay(
      activePlan,
      completedMoves,
      changeReason,
      remainingMinutes,
      newEnergy
    );

    // Supersede current plan
    const supersededOldPlan: DailyPlan = { ...activePlan, status: 'superseded' };

    if (!isGuest && user) {
      // Update old plan in Supabase
      await supabase.from('daily_plans').update({ status: 'superseded' }).eq('id', activePlan.id);

      // Insert new plan
      const { key_moves, ...planRecord } = newVersion;
      await supabase.from('daily_plans').insert(planRecord);

      // Insert new moves
      if (key_moves && key_moves.length > 0) {
        await supabase.from('key_moves').insert(key_moves);
      }
    }

    setActivePlan(newVersion);
    setPlanHistory((prev) => [newVersion, supersededOldPlan, ...prev.filter((p) => p.id !== activePlan.id)]);

    return newVersion;
  };

  // 4. Goals CRUD
  const addGoal = async (title: string, description?: string, targetDate?: string) => {
    const userId = user?.id || 'sample-user';
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      description: description || null,
      target_date: targetDate || null,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setGoals((prev) => [newGoal, ...prev]);

    if (!isGuest && user) {
      await supabase.from('goals').insert(newGoal);
    }
  };

  const updateGoalStatus = async (goalId: string, status: Goal['status']) => {
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, status } : g)));
    if (!isGuest && user) {
      await supabase.from('goals').update({ status }).eq('id', goalId);
    }
  };

  const deleteGoal = async (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    if (!isGuest && user) {
      await supabase.from('goals').delete().eq('id', goalId);
    }
  };

  // 4b. Projects CRUD
  const addProject = async (
    title: string,
    description: string,
    priority: Project['priority'],
    targetDate?: string,
    initialTasks: string[] = []
  ) => {
    const userId = user?.id || 'sample-user';
    const newProj: Project = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      description,
      status: 'active',
      priority,
      target_date: targetDate || null,
      created_at: new Date().toISOString(),
      tasks: initialTasks.map((t) => ({
        id: crypto.randomUUID(),
        title: t,
        completed: false,
      })),
    };
    setProjects((prev) => [newProj, ...prev]);
    if (!isGuest && user) {
      await supabase.from('projects').insert(newProj);
    }
  };

  const toggleProjectTask = async (projectId: string, taskId: string) => {
    let updatedTasks: any[] = [];
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newTasks = p.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        updatedTasks = newTasks;
        return {
          ...p,
          tasks: newTasks,
        };
      })
    );
    if (!isGuest && user && updatedTasks.length > 0) {
      await supabase.from('projects').update({ tasks: updatedTasks }).eq('id', projectId);
    }
  };

  const updateProjectStatus = async (projectId: string, status: Project['status']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );
    if (!isGuest && user) {
      await supabase.from('projects').update({ status }).eq('id', projectId);
    }
  };

  const deleteProject = async (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (!isGuest && user) {
      await supabase.from('projects').delete().eq('id', projectId);
    }
  };

  // 5. CEO Journal CRUD
  const addJournalEntry = async (
    type: JournalEntryType,
    content: string,
    title?: string,
    mood?: string
  ): Promise<JournalEntry> => {
    const userId = user?.id || 'sample-user';
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      user_id: userId,
      local_date: todayDate,
      entry_type: type,
      title: title || null,
      content,
      mood: mood || null,
      ai_summary: null,
      ai_analysis_enabled: false,
      created_at: now,
      updated_at: now,
    };

    setJournalEntries((prev) => [entry, ...prev]);

    if (!isGuest && user) {
      await supabase.from('journal_entries').insert(entry);
    }

    return entry;
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const updated = { ...updates, updated_at: new Date().toISOString() };
    setJournalEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    if (!isGuest && user) {
      await supabase.from('journal_entries').update(updated).eq('id', id);
    }
  };

  const deleteJournalEntry = async (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
    if (!isGuest && user) {
      await supabase.from('journal_entries').delete().eq('id', id);
    }
  };

  // 6. Opt-in AI Reflection for a Journal Entry
  const generateJournalReflection = async (entryId: string) => {
    const target = journalEntries.find((e) => e.id === entryId);
    if (!target) return;

    const reflection = await generateAIReflection(target);
    const summaryText = `${reflection.summary}\n\n• ${reflection.observations.join('\n• ')}\n\nStrategic Lesson: ${reflection.lesson}\nNext Step: ${reflection.nextAction}`;

    await updateJournalEntry(entryId, {
      ai_summary: summaryText,
      ai_analysis_enabled: true,
    });
  };

  // 7. Evening Review
  const submitEveningReview = async (
    reviewData: Omit<DailyReview, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'local_date'>
  ) => {
    const userId = user?.id || 'sample-user';
    const now = new Date().toISOString();
    const review: DailyReview = {
      id: crypto.randomUUID(),
      user_id: userId,
      local_date: todayDate,
      ...reviewData,
      created_at: now,
      updated_at: now,
    };

    setReviews((prev) => [review, ...prev.filter((r) => r.local_date !== todayDate)]);

    if (!isGuest && user) {
      await supabase.from('daily_reviews').upsert(review);
    }
  };

  // 8. Decision Room
  const addDecision = async (
    question: string,
    options: { id: string; text: string; pros: string[]; cons: string[] }[]
  ): Promise<Decision> => {
    const userId = user?.id || 'sample-user';
    const dec: Decision = {
      id: crypto.randomUUID(),
      user_id: userId,
      question,
      options,
      created_at: new Date().toISOString(),
    };

    // Synthesize structured executive analysis
    const analysis = await analyzeDecision(dec);
    dec.analysis = analysis;

    setDecisions((prev) => [dec, ...prev]);

    if (!isGuest && user) {
      await supabase.from('decisions').insert(dec);
    }

    return dec;
  };

  const updateDecisionChoice = async (decisionId: string, chosenOption: string) => {
    setDecisions((prev) => prev.map((d) => (d.id === decisionId ? { ...d, chosen_option: chosenOption } : d)));
    if (!isGuest && user) {
      await supabase.from('decisions').update({ chosen_option: chosenOption }).eq('id', decisionId);
    }
  };

  // Reset to sample dataset (demo utility)
  const resetToSampleData = () => {
    setCheckin(SAMPLE_CHECKIN);
    setActivePlan(SAMPLE_PLAN);
    setPlanHistory([SAMPLE_PLAN]);
    setGoals(SAMPLE_GOALS);
    setProjects(SAMPLE_PROJECTS);
    setJournalEntries(SAMPLE_JOURNAL_ENTRIES);
    setReviews(SAMPLE_REVIEWS);
    setDecisions(SAMPLE_DECISIONS);
  };

  const clearAllUserData = () => {
    setCheckin(null);
    setActivePlan(null);
    setPlanHistory([]);
    setGoals([]);
    setProjects([]);
    setJournalEntries([]);
    setReviews([]);
    setDecisions([]);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        todayDate,
        checkin,
        activePlan,
        planHistory,
        goals,
        projects,
        journalEntries,
        reviews,
        decisions,
        isLoading,
        isGeneratingPlan,
        submitCheckin,
        toggleKeyMove,
        executeReplan,
        addGoal,
        updateGoalStatus,
        deleteGoal,
        addProject,
        toggleProjectTask,
        updateProjectStatus,
        deleteProject,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        generateJournalReflection,
        submitEveningReview,
        addDecision,
        updateDecisionChoice,
        resetToSampleData,
        clearAllUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
