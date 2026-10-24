# 👑 The Daily CEO — Executive Operating System

> **A high-leverage, AI-augmented daily command center designed specifically for Founders, CEOs, and Senior Executives.**
> Built with React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, and Google Gemini AI.

---

## 📋 Table of Contents
1. [Overview & Philosophy](#overview--philosophy)
2. [Key Capabilities & Features](#key-capabilities--features)
3. [Design System & Aesthetics](#design-system--aesthetics)
4. [Technology Stack](#technology-stack)
5. [Project Architecture & Directory Structure](#project-architecture--directory-structure)
6. [Complete Function-by-Function Reference](#complete-function-by-function-reference)
   - [Authentication & Identity (`AuthContext.tsx`)](#1-authentication--identity-authcontexttsx)
   - [Core Data & Persistence Engine (`DataContext.tsx`)](#2-core-data--persistence-engine-datacontexttsx)
   - [AI Executive Intelligence (`aiEngine.ts`)](#3-ai-executive-intelligence-aienginets)
   - [Task Alert Intelligence & Gmail Dispatch (`reminderService.ts`)](#4-task-alert-intelligence--gmail-dispatch-reminderservicets)
   - [Date & Time Utilities (`dates.ts`)](#5-date--time-utilities-datests)
   - [Supabase Client & Edge Function Persistence (`supabase.ts`)](#6-supabase-client--edge-function-persistence-supabasets)
7. [Pages & Application Views](#pages--application-views)
8. [Dashboard Components & Widgets](#dashboard-components--widgets)
9. [Executive Strategy Suite](#executive-strategy-suite)
10. [Database Schema & Security (Row Level Security)](#database-schema--security-row-level-security)
11. [Getting Started & Local Setup](#getting-started--local-setup)

---

## Overview & Philosophy

**The Daily CEO** is not another generic to-do list. It is an **Executive Operating System (EOS)** engineered to safeguard a leader’s most finite resource: **high-leverage cognitive focus**.

Standard productivity apps treat all tasks equally. In reality, a CEO's workday is governed by non-linear leverage:
- **1 hour of deep strategy** can yield $1,000,000 in enterprise value.
- **1 hour of operational toil** yields $25 in value and drains willpower.

The Daily CEO structures your day around three non-negotiable rituals:
1. **Morning Check-In**: Calibrate energy (1–10), log emotional state, set today's single Primary Mission, and generate a focused 3-move plan.
2. **Command Center Execution**: An interactive 8:00 AM – 8:00 PM timeline that protects deep work blocks and displays real-time progress.
3. **Evening Shutdown Review**: Lock in daily wins, extract AI strategic lessons, and disconnect completely to recharge cognitive stamina.

---

## Key Capabilities & Features

- **Executive Command Center Timeline**: An interactive, horizontal 8 AM – 8 PM timeline displaying priority widgets, focus duration, and live completion checkmarks.
- **Dynamic Widget Addition**: Add multiple high-impact priority moves consecutively with 1-click CEO presets (Deep Work Sprint, Strategy Call, Board Review, etc.) without resetting or recreating the day plan.
- **Real Executive Strategy Suite**: Direct access to 5 battle-tested CEO operating playbooks (Paul Graham, Jeff Bezos, Andy Grove, Warren Buffett, Peter Thiel) that can be adopted with 1 click to realign daily decision filters.
- **Mid-Day Replan Protocol**: When emergencies strike, the AI Day Replanner preserves completed work and recalculates the remaining time budget to prevent burnout.
- **Decision Room Matrix**: A dedicated simulation room to stress-test complex, high-stakes decisions using reversible (Type 2) vs. irreversible (Type 1) criteria with multi-option pros/cons analysis.
- **CEO Strategic Journal**: A leadership log supporting 6 specialized entry modes (Reflection, Win, Decision, Idea, Lesson, Freewrite) with AI-powered synthesis.
- **Executive Gmail Reminders & Smart Task Alerts**: Real-time intelligence that monitors pending, missed, and at-risk commitments. If tasks are passed over or remaining workday time is insufficient to finish today's workload, it sends an executive briefing to your Gmail with a direct 1-click CTA link returning you back to the command center.
- **Dual Persistence Architecture**: Seamlessly operates in either **Instant Sandbox Demo Mode** (local cache for rapid evaluation) or **Cloud PostgreSQL Mode** backed by Supabase with Row Level Security (RLS).

---

## Design System & Aesthetics

The application adheres to a **luxury executive aesthetic**:
- **Palette**: Deep void blacks (`#08090d`, `#0c0e14`, `#12151d`), warm executive ambers (`#f59e0b`, `#fbbf24`, `#d97706`), subtle emerald accents (`#10b981`), and titanium borders (`rgba(255,255,255,0.08)`).
- **Glassmorphism**: Multi-layered backdrop blurs (`backdrop-filter: blur(20px) saturate(160%)`) with specular top-edge light reflection lips (`::before`) and animated light sheen beams (`::after`).
- **OriginKit Full Frame Abstract**: Hardware-accelerated canvas background animation (`HarpCoil`) dynamically reacting to mouse position and ambient lighting.
- **Progress Shimmer**: Golden progress bar with directional light sweep (`animate-bar-shine`).

---

## Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Strict type checking, modern hooks, functional component architecture |
| **Build & Tooling** | Vite 8 + Rollup | Instant hot module replacement (HMR), sub-second production builds |
| **Routing** | React Router v7 | Nested shell layouts, protected route guards, fallback redirects |
| **Styling** | Vanilla CSS + Tailwind CSS | Custom executive design system (`.card-ceo`, `.card-executive`, `.card-glass`) |
| **Backend / DB** | Supabase PostgreSQL | Fully typed tables with strict Row Level Security (RLS) policies per User ID |
| **Authentication** | Supabase Auth | Email + Password, 6-digit Email OTP confirmation, Google OAuth, Demo Sandbox |
| **AI Intelligence** | Google Gemini 2.5 Flash / Built-in | Structured strategic analysis, prompt engineering, fallback offline engine |
| **Icons & Visuals** | Lucide React + Canvas Confetti | Crisp executive iconography, milestone celebrations |

---

## Project Architecture & Directory Structure

```
the-daily-ceo/
├── index.html                   # HTML entry point with luxury typography & meta tags
├── src/
│   ├── main.tsx                 # React application mounting
│   ├── App.tsx                  # Root router configuration & route protection guards
│   ├── index.css                # Core design system, glassmorphism tokens, and animations
│   ├── types/
│   │   └── index.ts             # Global TypeScript interfaces & domain types
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication, session, and user profile management
│   │   └── DataContext.tsx       # Central state store for daily plans, goals, projects, etc.
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client singleton initialization
│   │   ├── aiEngine.ts          # AI prompt engineering & Gemini API integration
│   │   ├── dates.ts             # Timezone-aware date and timeline utility functions
│   │   └── sampleData.ts        # Comprehensive executive mock seed dataset
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx             # Master application shell wrapper
│   │   │   ├── ExecutiveHeader.tsx    # Floating frosted glass navbar with profile menu
│   │   │   └── DesignBackground.tsx   # OriginKit canvas & ambient aura layer
│   │   ├── dashboard/
│   │   │   ├── CommandCenterTimeline.tsx # 8 AM – 8 PM interactive task timeline
│   │   │   ├── AddWidgetModal.tsx        # Add priority widget modal with 1-click presets
│   │   │   ├── StrategyModal.tsx         # Executive Strategy Suite with 5 CEO frameworks
│   │   │   ├── CeoInsightCard.tsx        # Dynamic daily CEO insight with golden mountain art
│   │   │   ├── ExecutiveMetricCards.tsx  # Deep work, energy score, and momentum metrics
│   │   │   ├── PrimaryMissionCard.tsx    # Today's #1 objective card
│   │   │   ├── DecisionFilterCard.tsx    # If/Then operational decision filter card
│   │   │   ├── EnergyAdviceCard.tsx      # Cognitive sequencing & energy protocol card
│   │   │   ├── ShutdownRitualCard.tsx    # Evening ritual checklist card
│   │   │   ├── ReplanModal.tsx           # Mid-day plan recalibration modal
│   │   │   └── GoldenWaves.tsx           # SVG art asset for CEO insight card
│   │   ├── common/
│   │   │   └── HowToUseSection.tsx       # Interactive step-by-step onboarding guide
│   │   ├── originkit/ui/
│   │   │   └── full-frame-abstract.tsx   # Dynamic interactive HarpCoil canvas background
│   │   └── talk/
│   │       └── CommandAssistant.tsx      # Global ⌘K executive AI assistant dialog
│   └── pages/
│       ├── DashboardPage.tsx     # Main executive dashboard
│       ├── CheckInPage.tsx       # Morning check-in & day calibration wizard
│       ├── ProjectsPage.tsx      # High-leverage company initiatives & milestone tasks
│       ├── GoalsPage.tsx         # Annual & quarterly strategic OKRs
│       ├── JournalPage.tsx       # Leadership journal with AI reflection generator
│       ├── DecisionRoomPage.tsx  # Executive decision matrix (Type 1 vs. Type 2)
│       ├── HistoryPage.tsx       # Historical timeline of past daily plans and moves
│       ├── ReviewPage.tsx        # Evening shutdown ritual and wins logger
│       ├── InsightsPage.tsx      # Productivity, focus time, and energy analytics
│       ├── SettingsPage.tsx      # Profile, timezone detection, and cloud configuration
│       └── AuthPage.tsx          # Sign In / Sign Up with 6-digit OTP verification & Demo
```

---

## Complete Function-by-Function Reference

### 1. Authentication & Identity (`AuthContext.tsx`)

The authentication provider manages user state, Supabase auth sessions, profile synchronization, and offline demo access.

#### `signIn(email, password)`
- **Purpose**: Authenticates an existing user via Supabase with email and password credentials.
- **Behavior**: Calls `supabase.auth.signInWithPassword()`. If successful, sets the active `session` and `user`, and automatically triggers `fetchOrCreateProfile()` to load custom user preferences.
- **Error Handling**: Catches invalid credentials, network errors, and displays a user-friendly error string.

#### `signUp(email, password, fullName)`
- **Purpose**: Registers a new executive account.
- **Behavior**: Calls `supabase.auth.signUp()` with metadata containing `full_name`. Sets local state to `awaiting_verification` so the UI presents the 6-digit confirmation code verification screen.

#### `resendConfirmationEmail(email)`
- **Purpose**: Resends the signup confirmation OTP email to the user if the initial token expired or failed to arrive.
- **Behavior**: Invokes `supabase.auth.resend({ type: 'signup', email })`.

#### `verifyOtp(email, token, type)`
- **Purpose**: Verifies a 6-digit numeric token sent to the user's email address.
- **Behavior**: Calls `supabase.auth.verifyOtp({ email, token, type })`. On verification, transitions the session into active authenticated state and creates their database profile row.

#### `resetPassword(email)`
- **Purpose**: Initiates a forgotten password recovery sequence.
- **Behavior**: Calls `supabase.auth.resetPasswordForEmail()` configured with the application callback URL.

#### `updatePassword(newPassword)`
- **Purpose**: Sets a new user password following a successful password reset or from account settings.
- **Behavior**: Calls `supabase.auth.updateUser({ password: newPassword })`.

#### `signInWithGoogle()`
- **Purpose**: Initiates OAuth 2.0 authentication via Google.
- **Behavior**: Redirects user to Google OAuth endpoint via `supabase.auth.signInWithOAuth({ provider: 'google' })`.

#### `signOut()`
- **Purpose**: Terminates active user session and clears all memory and cache tokens.
- **Behavior**: Calls `supabase.auth.signOut()`, marks `the_daily_ceo_logged_out` in `sessionStorage`, nullifies `user`, `session`, `profile`, and redirects the route to `/login`.

#### `continueAsDemoUser()`
- **Purpose**: Provides immediate, zero-friction access for hackathon evaluators and demo testers without requiring an email account.
- **Behavior**: Sets `isGuest = true`, loads mock executive profile credentials (`Alex Vance`), and hydrates the full demo workspace dataset.

#### `updateProfile(updates)`
- **Purpose**: Persists display name, custom role, timezone, schedule windows, and AI keys.
- **Behavior**: Merges new fields with existing profile state, immediately updates React state for zero-latency UI responsiveness, and calls `supabase.from('profiles').upsert(...)` to persist changes to PostgreSQL with full error logging.

#### `fetchOrCreateProfile(currentUser)`
- **Purpose**: Ensures every authenticated user has a corresponding row in the `public.profiles` PostgreSQL table.
- **Behavior**: Queries `profiles` by `currentUser.id`. If no row exists, creates and inserts a default profile containing their registered name, email handle, and browser-detected timezone.

---

### 2. Core Data & Persistence Engine (`DataContext.tsx`)

The central data hub that orchestrates the daily executive cycle, managing plans, widgets, goals, projects, journals, and decisions.

#### `loadData()`
- **Purpose**: Hydrates the entire application workspace upon initial mount or auth transition.
- **Behavior**: In Supabase mode, executes parallel queries (`daily_plans`, `goals`, `projects`, `journal_entries`, `daily_reviews`, `decisions`) filtered by `user_id = user.id`. If queries fail or the user is in guest mode, loads cached data from `localStorage` or initial sample data.

#### `submitCheckin(checkinData)`
- **Purpose**: Processes the daily morning check-in questionnaire (energy, mood, available minutes, main goal, obstacles).
- **Behavior**:
  1. Inserts a new row into `daily_checkins`.
  2. Calls `generateDailyPlan()` in `aiEngine.ts` to synthesize a strategic day plan.
  3. Inserts the generated plan into `daily_plans` and its moves into `key_moves`.
  4. Sets `activePlan` in state, triggering real-time dashboard updates.

#### `toggleKeyMove(moveId)`
- **Purpose**: Toggles a Command Center priority between `pending` and `completed`.
- **Behavior**:
  1. Updates the item's `status` and `completed_at` timestamp in `activePlan.key_moves`.
  2. If marked complete, fires a celebratory `canvas-confetti` animation.
  3. Automatically recalculates the completed count and progress percentage bar.
  4. Persists the status update to Supabase table `key_moves`.

#### `addKeyMove(title, estimatedMinutes, priority, description, timeSlot)`
- **Purpose**: Adds a new widget / focus block directly to the active Command Center timeline **without resetting or recreating the plan**.
- **Behavior**:
  1. Instantiates a new `KeyMove` object with a unique UUID, title, duration, priority tier, and scheduled time window.
  2. Appends the new move to `activePlan.key_moves` (or initializes a day plan container if one does not exist yet).
  3. Inserts the row into `key_moves` table in Supabase.
  4. Updates the dashboard timeline and priority count immediately.

#### `deleteKeyMove(moveId)`
- **Purpose**: Removes an individual widget from the active day's Command Center.
- **Behavior**: Filters out the target move from `activePlan.key_moves`, updates local state, and executes `supabase.from('key_moves').delete().eq('id', moveId)`.

#### `updateActivePlanStrategy(mission, filter, energyAdvice)`
- **Purpose**: Adopts an executive battle-tested operating framework (e.g. Maker vs. Manager, Bezos Decision Velocity, Andy Grove Leverage) into the live plan.
- **Behavior**:
  1. Overwrites `primary_mission`, `decision_filter`, and `energy_advice` on `activePlan`.
  2. Increments `activePlan.version` to maintain audit history.
  3. Calls `supabase.from('daily_plans').upsert(...)` to persist the adopted strategy to PostgreSQL.

#### `executeReplan(changeReason, remainingMinutes, newEnergy)`
- **Purpose**: Executes mid-day plan recalibration when schedules get interrupted.
- **Behavior**:
  1. Extracts all currently `completed` key moves to permanently lock in progress.
  2. Passes completed moves, new time budget, and change reason to `replanRemainingDay()`.
  3. Marks the old plan as `status: 'superseded'`.
  4. Inserts a new revised plan version (`v2`, `v3`) with restructured pending moves and activates it immediately.

#### `addGoal(title, description, targetDate)` / `updateGoalStatus` / `deleteGoal`
- **Purpose**: Full CRUD management of strategic executive goals and milestones.
- **Behavior**: Manages goal entities in `goals` table, tracking status (`active`, `completed`, `paused`) and target dates.

#### `addProject(...)` / `toggleProjectTask(...)` / `updateProjectStatus(...)` / `deleteProject(...)`
- **Purpose**: Management of multi-task company initiatives and quarterly deliverables.
- **Behavior**: Stores projects with nested JSON task arrays (`tasks: [{ id, text, completed }]`). Allows completing sub-tasks with real-time completion ratio updates.

#### `addJournalEntry(...)` / `updateJournalEntry(...)` / `deleteJournalEntry(...)`
- **Purpose**: Strategic leadership journal management across 6 entry archetypes.
- **Behavior**: Stores rich reflection entries with mood tagging and automatic timestamps in `journal_entries` table.

#### `generateJournalReflection(entryId)`
- **Purpose**: Runs AI cognitive synthesis over a journal entry.
- **Behavior**: Sends entry content to `generateAIReflection()` in `aiEngine.ts`. Updates entry with structured AI summary, observations, strategic lessons, and recommended next actions.

#### `submitEveningReview(review)`
- **Purpose**: Finalizes daily shutdown ritual.
- **Behavior**: Records day rating (1–5 stars), top wins, lessons learned, and tomorrow's queued priority into `daily_reviews`.

#### `addDecision(question, options)` / `updateDecisionChoice(decisionId, chosenOption)`
- **Purpose**: Simulates complex executive decisions in the Decision Room.
- **Behavior**: Stores decision scenarios with structured option matrices (pros, cons, risk profile) in `decisions` table.

#### `resetToSampleData()`
- **Purpose**: One-click restore utility for judges and evaluators to re-seed realistic executive sample data across all modules.

#### `clearAllUserData()`
- **Purpose**: One-click wipe utility to reset workspace to an absolute blank state for testing clean-slate onboarding.

---

### 3. AI Executive Intelligence (`aiEngine.ts`)

The AI engine abstracts interaction with Google Gemini models and handles structured prompting for executive planning.

#### `callGeminiAPI(systemPrompt, userPrompt, apiKey?)`
- **Purpose**: Low-level communication bridge to Google Gemini API endpoints (`gemini-2.5-flash`).
- **Behavior**: Formats requests with JSON schema expectations and temperature settings. If user provides a custom key in Settings, utilizes their private key; otherwise gracefully routes through built-in engine.

#### `generateDailyPlan(checkin, profile, goals, activeProjects)`
- **Purpose**: Core algorithm transforming morning check-in questionnaire into a realistic daily execution plan.
- **Output Schema**:
  - `primaryMission`: Single highest-leverage objective of the day with success criteria.
  - `keyMoves`: 3 structured priorities with estimated minutes, priority tiers, and scheduled time windows.
  - `decisionFilter`: Concrete If/Then/Defer rules tailored to today's obstacles.
  - `energyAdvice`: Cognitive sequencing advice based on user energy level.
  - `shutdownRitual`: 3-step evening disconnect checklist.

#### `replanRemainingDay(currentPlan, completedMoves, changeReason, remainingMinutes, newEnergy)`
- **Purpose**: Recalibrates remaining day moves when an executive schedule gets derailed.
- **Behavior**: Locks in completed moves, compresses remaining tasks to fit the new time budget, and updates the strategic filter to prevent secondary blowouts.

#### `generateAIReflection(entryContent, entryType)`
- **Purpose**: Performs executive coaching synthesis over raw journal notes.
- **Output Schema**: Returns concise `summary`, 2–3 behavioral `observations`, a high-level `lesson`, and a high-leverage `nextAction`.

#### `analyzeDecision(decisionQuestion, options)`
- **Purpose**: Acts as an objective Chief of Staff reviewing complex business decisions.
- **Behavior**: Evaluates each candidate option against Type 1 (irreversible) vs. Type 2 (reversible) criteria, identifies hidden blind spots, and provides an executive recommendation.

---

### 4. Task Alert Intelligence & Gmail Dispatch (`reminderService.ts`)

The reminder engine provides continuous surveillance over active commitments, detecting missed focus blocks and workday capacity shortfalls.

#### `parseTimeSlot(slotStr)`
- **Purpose**: Parses flexible time string expressions (e.g. `"9:00 AM - 10:30 AM"`, `"2 PM - 3:30 PM"`) into absolute minutes from midnight (`startMinutes` and `endMinutes`).

#### `analyzePendingTasks(keyMoves, profile)`
- **Purpose**: Evaluates all pending tasks against current wall-clock time and the user's scheduled workday end cutoff (`preferences.work_end_hour`, default `18` / 6:00 PM).
- **Behavior & Output**:
  - `missedTasks`: Focus blocks whose scheduled slot has already elapsed today while remaining in `pending` status.
  - `atRiskTasks`: Tasks where remaining available minutes in the workday are insufficient to complete them.
  - `pendingTasks`: All active unfinished commitments.
  - `isOverCapacity`: Boolean flag that becomes `true` when total pending estimated minutes exceed remaining workday minutes.
  - `remainingMinutesInWorkday`: Number of minutes remaining before the configured evening work cutoff.

#### `dispatchGmailReminder(options)`
- **Purpose**: Dispatches an executive status briefing to the user's Gmail and creates a 1-click Web Compose draft.
- **Behavior**:
  1. Compiles a high-impact notification with missed tasks, time-constrained items, and remaining focus blocks.
  2. Injects a direct, authenticated CTA link (`http://localhost:5173/`) directing the user back into the application.
  3. Dispatches via the deployed Supabase Edge Function (`send-task-reminder`) with luxury HTML formatting.
  4. Records an audit trail in Supabase table `reminder_logs` (`recipient_email`, `missed_count`, `pending_count`, `at_risk_count`, `dispatched_at`).
  5. Generates a foolproof 1-click Gmail Web URL (`https://mail.google.com/mail/?view=cm&fs=1&to=...`) enabling immediate draft opening from any device without requiring third-party credentials.

---

### 5. Date & Time Utilities (`dates.ts`)

#### `getTodayLocalDate()`
- **Purpose**: Returns today's date formatted as `YYYY-MM-DD` in the user's local timezone (preventing UTC offset date shifts).

#### `formatFriendlyDate(dateStr)`
- **Purpose**: Formats ISO date strings into readable executive headers (e.g., `"Saturday, October 24"` or `"SAT, OCT 24"`).

#### `formatMinutes(minutes)`
- **Purpose**: Converts minute integers into clean time labels (e.g. `90` &rarr; `"1h 30m"`, `45` &rarr; `"45m"`).

---

### 6. Supabase Client & Edge Function Persistence (`supabase.ts`)

- Initializes the client singleton via `createClient(supabaseUrl, supabaseAnonKey)`.
- Configured with persistent local session storage, automatic token refresh, and Edge Function invocation capabilities.

---

## Pages & Application Views

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/` | Executive Command Center timeline, metric cards, CEO insight, and strategy suite. |
| **Planner / Check-In** | `/checkin` | 4-step morning calibration wizard (energy, mood, available minutes, obstacles). |
| **Projects** | `/projects` | Corporate initiatives, milestone tracking, and task checklists. |
| **Goals** | `/goals` | Annual & quarterly strategic OKRs with target dates and status. |
| **Journal** | `/journal` | Leadership journal with 6 entry modes and AI reflection analysis. |
| **Decision Room** | `/decision-room` | Executive decision matrix for weighing reversible vs irreversible choices. |
| **Evening Review** | `/review` | End-of-day shutdown ritual, day rating, and wins logger. |
| **History** | `/history` | Archive of past daily plans, completion percentages, and superseded replans. |
| **Insights** | `/insights` | Analytics dashboard displaying deep work minutes, energy trends, and completion rate. |
| **Settings** | `/settings` & `/profile` | Profile identity, timezone auto-detection, work schedule, AI keys, and demo data utilities. |
| **Auth** | `/login` | Dual-mode authentication (Email/Password, 6-digit OTP code, Google OAuth, Demo Access). |

---

## Dashboard Components & Widgets

### 1. `CommandCenterTimeline.tsx`
- **What it does**: Renders an interactive horizontal timeline spanning 8:00 AM to 8:00 PM.
- **Key Mechanics**:
  - Dynamically renders **all scheduled widgets** without arbitrary slice limits.
  - Automatically calculates time-slot positions (`left` and `width` percentages) along the timeline.
  - Displays each widget’s full title, duration, time window, priority badge, and completion toggle.
  - Includes a hover delete button (`onDeleteMove`) to quickly remove widgets.
  - Features an integrated `+ Add widget` button directly inside the header.

### 2. `AddWidgetModal.tsx`
- **What it does**: A modal dialog for scheduling new priority widgets into the active day plan.
- **Key Mechanics**:
  - Custom Title input with autofocus.
  - **1-Click CEO Presets**: Instant pre-fills for Deep Work, Strategy Call, Board Deck Review, Architecture Sync, Financial Review, and Leadership 1-on-1.
  - Time Slot selector with quick chips (`8:30 AM – 9:30 AM`, `10:00 AM – 11:30 AM`, etc.).
  - Estimated duration and priority tier selectors.
  - Directly calls `addKeyMove()` without recreating or resetting the day plan.

### 3. `CeoInsightCard.tsx`
- **What it does**: Displays the daily strategic focus quote alongside custom golden mountain art.
- **Key Mechanics**: Clicking the **"View strategy"** button opens the `StrategyModal`.

### 4. `GmailReminderModal.tsx`
- **What it does**: Executive task alert dialog monitoring pending, missed, and at-risk commitments.
- **Key Mechanics**:
  - Automatically identifies **Missed Tasks** (scheduled slot has passed) and **At-Risk Tasks** (remaining workday minutes < total estimated minutes needed).
  - Offers dual dispatch paths: Cloud dispatch via Supabase Edge Function (`send-task-reminder`) or 1-click **Gmail Web Draft** launcher with pre-filled subject, breakdown, and return link.
  - Direct shortcut to launch the mid-day **Replan Protocol** to dynamically rebalance workloads.

---

## Executive Strategy Suite

Implemented in [`StrategyModal.tsx`](src/components/dashboard/StrategyModal.tsx), the Strategy Suite offers two powerful views:

### Tab 1: Real Executive Frameworks
Presents 5 battle-tested CEO operating playbooks:
1. **Maker vs. Manager Separation (Paul Graham)**: Protects morning 9 AM – 1 PM blocks for solitary deep leverage; defers relational syncs to afternoon.
2. **Type 1 vs. Type 2 Decision Velocity (Jeff Bezos)**: Mandates making reversible Type 2 decisions with 70% data in < 15 minutes.
3. **High-Output Management 100x Multiplier (Andy Grove)**: Demands executive time be allocated strictly to activities with a 100x organizational output multiplier.
4. **Buffett 25/5 Ruthless Elimination (Warren Buffett)**: Focuses exclusively on the top 5 goals and treats the remaining 20 as the "Avoid At All Costs" list.
5. **Zero-to-One Monopoly Bottleneck (Peter Thiel)**: Attacks the single core constraint that, if unlocked, makes all other problems irrelevant.

*Clicking "Adopt Strategy" immediately synchronizes the active day's `primary_mission`, `decision_filter`, `energy_advice`, and `CeoInsightCard` on the dashboard.*

### Tab 2: Today's Active Blueprint
Displays the live `PrimaryMissionCard`, `DecisionFilterCard`, `EnergyAdviceCard`, and `ShutdownRitualCard` with full operational detail.

---

## Database Schema & Security (Row Level Security)

All data in Supabase is governed by strict **PostgreSQL Row Level Security (RLS)** policies ensuring users can only read, insert, and modify their own records (`auth.uid() = user_id`).

### Key Tables
- `profiles`: User credentials, display names, timezones, and preference JSON.
- `daily_checkins`: Morning check-in responses, energy scores, and obstacles.
- `daily_plans`: Generated daily plans with primary mission, decision filter, and ritual JSON.
- `key_moves`: Individual scheduled priority widgets associated with a daily plan.
- `goals`: Long-term quarterly and annual OKRs.
- `projects`: Initiatives and sub-task checklists.
- `journal_entries`: Strategic leadership reflections and AI analyses.
- `daily_reviews`: Evening shutdown ratings, wins, and lessons.
- `decisions`: Decision Room scenarios with multi-option pros/cons analysis.
- `reminder_logs`: Audit trail of dispatched task reminder briefings, recipient emails, missed/at-risk counts, and delivery status.

---

## Getting Started & Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd the-daily-ceo

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Production Build & Typecheck
```bash
npm run build
```
*Builds production assets to `dist/` with zero TypeScript errors.*

---

## 🏆 Summary
**The Daily CEO** delivers an unmatched executive experience combining razor-sharp strategic prioritization, luxury design aesthetics, rock-solid Supabase persistence, and cutting-edge Google Gemini AI intelligence.
