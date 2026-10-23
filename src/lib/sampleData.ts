import type { DailyPlan, DailyCheckin, Goal, JournalEntry, DailyReview, Decision, Project } from '../types';
import { getTodayLocalDate } from './dates';

const today = getTodayLocalDate();

// Yesterday's date
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterday = yesterdayDate.toISOString().slice(0, 10);

// Two days ago
const twoDaysAgoDate = new Date();
twoDaysAgoDate.setDate(twoDaysAgoDate.getDate() - 2);
const twoDaysAgo = twoDaysAgoDate.toISOString().slice(0, 10);

export const SAMPLE_GOALS: Goal[] = [
  {
    id: 'sample-goal-1',
    user_id: 'sample-user',
    title: 'Deliver Q4 Enterprise Strategy & Product Launch',
    description: 'Finalize architecture, align team roadmap, and complete high-leverage client pilots.',
    target_date: '2026-12-15',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-goal-2',
    user_id: 'sample-user',
    title: 'Achieve Sub-60s Executive Check-in Habit',
    description: 'Consistent morning ritual of prioritizing top mission over reactivity.',
    target_date: '2026-11-01',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'sample-goal-3',
    user_id: 'sample-user',
    title: 'Hiring Principal Backend Engineer',
    description: 'Screen candidates and close offers for backend engineering leadership.',
    target_date: '2026-10-30',
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
];

export const SAMPLE_CHECKIN: DailyCheckin = {
  id: 'sample-checkin-today',
  user_id: 'sample-user',
  local_date: today,
  energy: 8,
  mood: 'focused',
  main_goal: 'Finalize the strategic launch architecture and remove critical launch blockers',
  obstacles: 'Back-to-back ad-hoc pings and potential vendor API latency',
  available_minutes: 180,
  urgent_commitments: 'Board status sync at 4 PM',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const SAMPLE_PLAN: DailyPlan = {
  id: 'sample-plan-today',
  user_id: 'sample-user',
  checkin_id: 'sample-checkin-today',
  local_date: today,
  version: 1,
  status: 'active',
  primary_mission: {
    title: 'Finalize Strategic Launch Architecture & Isolate Key Dependencies',
    why: 'Provides asymmetric leverage for the entire Q4 milestone and prevents multi-day engineering churn.',
    successCriteria: 'Core system specs validated, critical vendor latency tested, and deployment checklist approved.',
    estimatedMinutes: 120,
  },
  decision_filter: {
    if: 'Non-urgent messages or meeting invites arrive before 2:00 PM',
    then: 'Defer review to batch block at 4:30 PM; do not derail the launch architecture sprint.',
    ignoreOrDefer: 'Routine inbox zero chasing, cosmetic UI tweaks, unsolicited vendor sales pitches.',
  },
  energy_advice: 'Energy is high at 8/10. Harness neuroplasticity during your morning 90-minute uninterrupted deep work block.',
  shutdown_ritual: [
    'Push all architectural commits and send summary update to stakeholders.',
    'Review completed Key Moves and log tomorrow morning opening move.',
    'Close Slack and email tabs 30 minutes before signing off.',
    'Step away from desk for physical decompression walk.',
  ],
  created_at: new Date().toISOString(),
  key_moves: [
    {
      id: 'move-1',
      plan_id: 'sample-plan-today',
      user_id: 'sample-user',
      priority: 1,
      title: 'Review and lock the core API pipeline specs',
      description: 'Audit critical endpoints and verify data schemas under stress conditions.',
      estimated_minutes: 60,
      status: 'completed',
      completed_at: new Date(Date.now() - 3600000).toISOString(),
      created_at: new Date().toISOString(),
      completionCriteria: 'Schema validated without regression.',
    },
    {
      id: 'move-2',
      plan_id: 'sample-plan-today',
      user_id: 'sample-user',
      priority: 2,
      title: 'Address vendor latency obstacle and establish circuit breaker fallback',
      description: 'Ensure graceful degradation if third-party services experience timeouts.',
      estimated_minutes: 45,
      status: 'pending',
      completed_at: null,
      created_at: new Date().toISOString(),
      completionCriteria: 'Fallback tests passing in staging.',
    },
    {
      id: 'move-3',
      plan_id: 'sample-plan-today',
      user_id: 'sample-user',
      priority: 3,
      title: 'Prepare executive brief for 4 PM board status sync',
      description: 'Condense current velocity, launch risk matrix, and resourcing needs into 3 bullet points.',
      estimated_minutes: 30,
      status: 'pending',
      completed_at: null,
      created_at: new Date().toISOString(),
      completionCriteria: '1-page brief ready for review.',
    },
  ],
};

export const SAMPLE_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    user_id: 'sample-user',
    local_date: today,
    entry_type: 'reflection',
    title: 'Morning Executive Clarity & Deep Work Session',
    content: 'Completed the core API pipeline specs in 50 minutes. Locking the door and muting notifications made a tremendous difference. Notice how easily 10-minute micro-distractions normally eat away prime morning clarity.',
    mood: 'focused',
    ai_summary: 'Observed significant speedup by shielding deep work from reactive pings. Recommended preserving morning block as an inviolable standard.',
    ai_analysis_enabled: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'journal-2',
    user_id: 'sample-user',
    local_date: yesterday,
    entry_type: 'win',
    title: 'Closed Principal Engineer Search',
    content: 'Candidate signed the offer letter. The extra focus on cultural alignment in the final round gave us both massive confidence. Great milestone for the team.',
    mood: 'energized',
    ai_summary: null,
    ai_analysis_enabled: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'journal-3',
    user_id: 'sample-user',
    local_date: twoDaysAgo,
    entry_type: 'decision',
    title: 'Opted for Minimalist Design System over Feature Creep',
    content: 'Decided to cut three secondary bells and whistles from MVP to guarantee rock-solid stability, zero lag, and flawless offline reliability. Less is exponentially more.',
    mood: 'neutral',
    ai_summary: 'Strategic decision to protect product quality by resisting feature creep. Strong correlation with execution velocity.',
    ai_analysis_enabled: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const SAMPLE_REVIEWS: DailyReview[] = [
  {
    id: 'review-yesterday',
    user_id: 'sample-user',
    local_date: yesterday,
    wins: 'Finished all 3 Key Moves and closed key hire offer.',
    obstacles: 'Afternoon energy slump around 3 PM due to heavy lunch.',
    lesson: 'Keep lunch light on days with strategic afternoon presentations.',
    tomorrow_first_action: 'Lock API pipeline architecture specs before checking morning messages.',
    mood_end: 'energized',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const SAMPLE_DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    user_id: 'sample-user',
    question: 'Should we build custom telemetry infrastructure or adopt managed OpenTelemetry?',
    options: [
      {
        id: 'opt-1',
        text: 'Adopt managed OpenTelemetry stack',
        pros: ['Saves 3 weeks of senior engineering time', 'Native compliance', 'Instant dashboarding'],
        cons: ['Slightly higher monthly SaaS bill ($180/mo)'],
      },
      {
        id: 'opt-2',
        text: 'Build lightweight in-house logging',
        pros: ['Zero recurring software subscription', 'Custom tailored data structure'],
        cons: ['Ongoing maintenance burden', 'Delays launch milestone by 18 days'],
      },
    ],
    analysis: {
      recommendation: 'Adopt managed OpenTelemetry immediately. Engineering hours are your scarcest asset right now.',
      tradeoffs: 'Higher dollar cost for 10x velocity. Trade money for time at this stage of the company.',
      missingInfo: 'Confirm retention policies and monthly tier limits for projected Q4 traffic.',
      whatWouldChangeRecommendation: 'If runway drops below 6 months or compliance prohibits cloud vendors.',
    },
    chosen_option: 'opt-1',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    user_id: 'sample-user',
    title: 'Enterprise Pilot & Product Launch',
    description: 'Finalize core API architecture, telemetry, and rollout to initial design partner pilot cohort.',
    status: 'active',
    priority: 'critical',
    target_date: '2026-11-15',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    tasks: [
      { id: 'task-1', title: 'Lock core API pipeline specs and latency fallback', completed: true, due_date: '2026-10-24' },
      { id: 'task-2', title: 'Test vendor rate limiting and circuit breakers', completed: true, due_date: '2026-10-25' },
      { id: 'task-3', title: 'Deploy staging environment for design partners', completed: false, due_date: '2026-10-28' },
      { id: 'task-4', title: 'Conduct executive demo with pilot stakeholders', completed: false, due_date: '2026-11-02' },
    ],
  },
  {
    id: 'proj-2',
    user_id: 'sample-user',
    title: 'Executive Routine & Cognitive Architecture',
    description: 'Establish a sub-60s daily check-in habit and uninterrupted morning deep work focus blocks.',
    status: 'active',
    priority: 'high',
    target_date: '2026-11-01',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    tasks: [
      { id: 'task-5', title: 'Institute 9:00 AM – 11:30 AM no-meeting policy', completed: true, due_date: '2026-10-20' },
      { id: 'task-6', title: 'Set up evening shutdown ritual debrief', completed: true, due_date: '2026-10-22' },
      { id: 'task-7', title: 'Measure 14-day consistency in Evidence Insights', completed: false, due_date: '2026-11-01' },
    ],
  },
  {
    id: 'proj-3',
    user_id: 'sample-user',
    title: 'Engineering Leadership Hiring',
    description: 'Screen principal engineering candidates and finalize onboarding roadmap.',
    status: 'completed',
    priority: 'medium',
    target_date: '2026-10-22',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
    tasks: [
      { id: 'task-8', title: 'Review 24 candidate portfolios and shortlist', completed: true, due_date: '2026-10-10' },
      { id: 'task-9', title: 'Conduct final culture & technical alignment rounds', completed: true, due_date: '2026-10-18' },
      { id: 'task-10', title: 'Candidate signed offer letter', completed: true, due_date: '2026-10-22' },
    ],
  },
  {
    id: 'proj-4',
    user_id: 'sample-user',
    title: 'Automated Telemetry & OpenTelemetry Integration',
    description: 'Managed monitoring to capture real-time application throughput and error budgets.',
    status: 'planning',
    priority: 'medium',
    target_date: '2026-11-20',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    tasks: [
      { id: 'task-11', title: 'Evaluate managed OTel SaaS pricing tiers', completed: true, due_date: '2026-10-24' },
      { id: 'task-12', title: 'Configure collector agents and error alerting', completed: false, due_date: '2026-11-10' },
    ],
  },
];
