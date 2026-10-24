export type Mood = 'energized' | 'focused' | 'neutral' | 'stressed' | 'tired';

export type PlanStatus = 'active' | 'superseded' | 'completed';
export type KeyMoveStatus = 'pending' | 'completed' | 'skipped';

export interface Profile {
  id: string;
  display_name: string | null;
  timezone: string;
  preferences: {
    work_start_hour?: number;
    work_end_hour?: number;
    default_break_minutes?: number;
    ai_provider?: 'builtin' | 'gemini' | 'openai';
    api_key?: string;
    role?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  target_date?: string | null;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  local_date: string;
  energy: number; // 1 - 10
  mood: Mood;
  main_goal: string;
  obstacles?: string | null;
  available_minutes: number;
  urgent_commitments?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrimaryMission {
  title: string;
  why: string;
  successCriteria: string;
  estimatedMinutes: number;
}

export interface KeyMove {
  id: string;
  plan_id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: 1 | 2 | 3;
  estimated_minutes: number;
  status: KeyMoveStatus;
  completed_at: string | null;
  created_at: string;
  completionCriteria?: string;
}

export interface DecisionFilter {
  if: string;
  then: string;
  ignoreOrDefer: string;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  checkin_id: string | null;
  local_date: string;
  version: number;
  status: PlanStatus;
  primary_mission: PrimaryMission;
  decision_filter: DecisionFilter;
  energy_advice: string;
  shutdown_ritual: string[];
  replan_reason?: string | null;
  created_at: string;
  key_moves?: KeyMove[];
}

export type JournalEntryType = 'reflection' | 'win' | 'decision' | 'idea' | 'lesson' | 'freewrite';

export interface AIReflectionData {
  summary: string;
  observations: string[];
  lesson: string;
  nextAction: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  local_date: string;
  entry_type: JournalEntryType;
  title: string | null;
  content: string;
  mood?: string | null;
  ai_summary: string | null;
  ai_analysis_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyReview {
  id: string;
  user_id: string;
  local_date: string;
  wins?: string | null;
  obstacles?: string | null;
  lesson?: string | null;
  tomorrow_first_action?: string | null;
  mood_end?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecisionOption {
  id: string;
  text: string;
  pros: string[];
  cons: string[];
}

export interface Decision {
  id: string;
  user_id: string;
  question: string;
  options: DecisionOption[];
  analysis?: {
    recommendation: string;
    tradeoffs: string;
    missingInfo?: string;
    whatWouldChangeRecommendation?: string;
  } | null;
  chosen_option?: string | null;
  created_at: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  due_date?: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'active' | 'planning' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  target_date?: string | null;
  tasks: ProjectTask[];
  created_at: string;
}
