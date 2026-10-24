import React, { useState } from 'react';
import {
  X,
  Target,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Filter,
  Ban,
  Clock,
  Compass,
  Layers,
  Award,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { PrimaryMission, DecisionFilter } from '../../types';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStrategyAdopted?: (title: string, body: string) => void;
}

export interface ExecutiveFramework {
  id: string;
  name: string;
  source: string;
  badge: string;
  coreLaw: string;
  decisionFilter: DecisionFilter;
  primaryMission: PrimaryMission;
  energyAdvice: string;
  insightTitle: string;
  insightBody: string;
}

export const REAL_EXECUTIVE_STRATEGIES: ExecutiveFramework[] = [
  {
    id: 'maker-manager',
    name: 'Maker vs. Manager Separation',
    source: 'Paul Graham (Y Combinator)',
    badge: 'Deep Work Armor',
    coreLaw:
      'A single 15-minute ad-hoc meeting in the morning destroys a 3-hour maker block. Protect mornings for solo deep leverage; group relational syncs strictly after 2:00 PM.',
    decisionFilter: {
      if: 'An ad-hoc meeting, call, or low-urgency question is requested before 1:00 PM',
      then: 'Categorically decline or defer to the afternoon manager window (post 2:00 PM)',
      ignoreOrDefer: 'Unscheduled Slack pings, non-critical email inbox triage before midday',
    },
    primaryMission: {
      title: 'Monopolize First 90-Minute Focus Block for Strategic Leverage',
      why: 'Executive output compounds in uninterrupted blocks of cognitive intensity.',
      successCriteria: 'Core needle-moving deliverable finalized before checking incoming messages.',
      estimatedMinutes: 90,
    },
    energyAdvice: 'Monastic solo focus during peak morning testosterone/cortisol peak; relational syncs post-lunch.',
    insightTitle: 'Protect your first focus block.',
    insightBody: 'Move meetings and small operational tasks strictly to the afternoon.',
  },
  {
    id: 'decision-velocity',
    name: 'Type 1 vs. Type 2 Decision Velocity',
    source: 'Jeff Bezos (Amazon)',
    badge: 'Speed Over Consensus',
    coreLaw:
      'Most decisions are two-way doors (reversible). Make them with 70% information in under 15 minutes. Save slow, exhaustive analysis strictly for irreversible Type 1 doors.',
    decisionFilter: {
      if: 'The decision consequences can be reversed, rewritten, or corrected within 30 days',
      then: 'Decide in under 15 minutes and empower the direct owner to execute immediately',
      ignoreOrDefer: 'Multi-stakeholder consensus meetings for reversible operational choices',
    },
    primaryMission: {
      title: 'Accelerate Reversible Decisions & Unblock Core Initiatives',
      why: 'Slowness is the #1 silent killer of high-growth ventures; momentum is oxygen.',
      successCriteria: 'Zero pending approvals older than 4 hours on executive desk.',
      estimatedMinutes: 60,
    },
    energyAdvice: 'Attack critical judgments before 11:00 AM before decision fatigue sets in.',
    insightTitle: 'Speed matters in executive decisions.',
    insightBody: 'Make reversible Type-2 decisions with 70% data. Avoid consensus paralysis.',
  },
  {
    id: 'high-output-management',
    name: 'High-Output 100x Multiplier',
    source: 'Andy Grove (Intel)',
    badge: 'Organizational Leverage',
    coreLaw:
      'A CEO’s output equals the output of all organizations under their influence. Allocate energy strictly to activities that have a 100x leverage multiplier.',
    decisionFilter: {
      if: 'A task can be executed at 80% quality by a direct report with brief guidance',
      then: 'Delegate with explicit success criteria and inspect progress only via structured 1-on-1s',
      ignoreOrDefer: 'Performing individual-contributor tasks just because you can do them faster',
    },
    primaryMission: {
      title: 'Eliminate Top Operational Bottleneck for Lead Directors',
      why: 'Unblocking a key leader unlocks 40+ engineering and operational hours for the business.',
      successCriteria: 'Top 3 blocker memos reviewed and clear guidance issued.',
      estimatedMinutes: 75,
    },
    energyAdvice: 'Inspect and coach leaders during mid-day energy; protect evening for strategic synthesis.',
    insightTitle: 'High leverage over low toil.',
    insightBody: 'Delegate everything below your 100x threshold. Build systems that run without you.',
  },
  {
    id: 'buffett-25-5',
    name: 'Buffett 25/5 Ruthless Elimination',
    source: 'Warren Buffett (Berkshire Hathaway)',
    badge: 'Ruthless Elimination',
    coreLaw:
      'Write down 25 goals. Circle your top 5. The remaining 20 become your Avoid-At-All-Costs list until your top 5 are executed.',
    decisionFilter: {
      if: 'An enticing opportunity arises that is ranked #6 or lower on your strategic roadmap',
      then: 'Say an immediate, polite "No". It is a distraction disguised as an opportunity',
      ignoreOrDefer: 'Secondary partnerships, side initiatives, and premature optimizations',
    },
    primaryMission: {
      title: 'Relentless Execution on Primary Milestone Objective',
      why: 'Secondary good ideas are the deadliest predators of great company outcomes.',
      successCriteria: 'Zero hours wasted on tertiary priorities; 100% focus on #1 goal.',
      estimatedMinutes: 90,
    },
    energyAdvice: 'Protect your cognitive bandwidth by eliminating 90% of secondary decisions.',
    insightTitle: 'Say "No" to the merely good.',
    insightBody: 'Protect bandwidth for the truly exceptional. Avoid priorities 6 through 25.',
  },
  {
    id: 'monopoly-bottleneck',
    name: 'Zero-to-One Monopoly Bottleneck',
    source: 'Peter Thiel (Founders Fund)',
    badge: 'Singular Focus',
    coreLaw:
      'Every day, attack the single core constraint that, if resolved, makes all other problems easier or irrelevant.',
    decisionFilter: {
      if: 'A fire drill or secondary issue threatens to pull executive focus from the core bottleneck',
      then: 'Contain the blast radius locally and mandate the team solve it without executive intervention',
      ignoreOrDefer: 'Cosmetic tweaks, vanity metrics, and incremental non-monopoly tasks',
    },
    primaryMission: {
      title: 'Break the Primary Growth & Product Constraint',
      why: 'Progress is not linear; resolving the singular bottleneck generates step-function returns.',
      successCriteria: 'Root-cause constraint dismantled with permanent systemic fix.',
      estimatedMinutes: 80,
    },
    energyAdvice: 'Attack the hardest, most uncomfortable constraint first thing in the morning.',
    insightTitle: 'Attack your singular bottleneck.',
    insightBody: 'Focus on the single constraint that renders all other challenges irrelevant.',
  },
];

export const StrategyModal: React.FC<StrategyModalProps> = ({
  isOpen,
  onClose,
  onStrategyAdopted,
}) => {
  const { activePlan, updateActivePlanStrategy } = useData();

  const [activeTab, setActiveTab] = useState<'frameworks' | 'blueprint'>('frameworks');
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('maker-manager');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMission = activePlan?.primary_mission || REAL_EXECUTIVE_STRATEGIES[0].primaryMission;
  const currentFilter = activePlan?.decision_filter || REAL_EXECUTIVE_STRATEGIES[0].decisionFilter;
  const currentAdvice = activePlan?.energy_advice || REAL_EXECUTIVE_STRATEGIES[0].energyAdvice;

  const handleAdoptStrategy = async (strategy: ExecutiveFramework) => {
    setSelectedStrategyId(strategy.id);
    await updateActivePlanStrategy(
      strategy.primaryMission,
      strategy.decisionFilter,
      strategy.energyAdvice
    );

    if (onStrategyAdopted) {
      onStrategyAdopted(strategy.insightTitle, strategy.insightBody);
    }

    setFeedback(`Activated "${strategy.name}". Today's Command Center & Decision Filter are now synchronized.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="card-ceo bg-[#0d1017]/95 border border-white/[0.12] rounded-2xl max-w-3xl w-full shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Executive Strategy Suite
                </h2>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Battle-Tested CEO Frameworks
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real operational heuristics used by top executives to dominate focus and execution.
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

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-1 border-b border-white/[0.06] flex items-center gap-3 shrink-0 bg-black/20">
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'frameworks'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Real Executive Frameworks ({REAL_EXECUTIVE_STRATEGIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'blueprint'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Today's Active Blueprint</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'frameworks' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 leading-relaxed bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/15">
                <span className="font-semibold text-amber-300">Executive Guidance: </span>
                Select and adopt any real operating strategy below. Adopting updates your primary mission, active decision filter, and executive insights card.
              </div>

              {REAL_EXECUTIVE_STRATEGIES.map((strategy) => {
                const isSelected = selectedStrategyId === strategy.id;

                return (
                  <div
                    key={strategy.id}
                    className={`card-ceo rounded-xl p-5 border transition-all duration-200 space-y-3.5 ${
                      isSelected
                        ? 'border-amber-400/50 bg-[#161a26] shadow-[0_10px_25px_-5px_rgba(245,158,11,0.12)]'
                        : 'border-white/[0.08] hover:border-white/[0.14] bg-[#10131d]'
                    }`}
                  >
                    {/* Strategy Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-100">{strategy.name}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                            {strategy.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Architect: <span className="text-amber-300/90">{strategy.source}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleAdoptStrategy(strategy)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto ${
                          isSelected
                            ? 'bg-amber-400 text-black shadow-md'
                            : 'bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-400/40 text-slate-200 hover:text-amber-300'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Active Strategy</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>Adopt Strategy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Core Law */}
                    <div className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Core Operating Law
                      </span>
                      <p>{strategy.coreLaw}</p>
                    </div>

                    {/* Decision Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/15">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1 flex items-center gap-1">
                          <Filter className="w-3 h-3" />
                          <span>IF Context Shift Occurs</span>
                        </span>
                        <p className="text-slate-300">{strategy.decisionFilter.if}</p>
                        <div className="mt-2 pt-2 border-t border-amber-500/10 text-amber-200">
                          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block mb-0.5">
                            THEN Executive Action
                          </span>
                          <p className="text-slate-200">{strategy.decisionFilter.then}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-rose-500/[0.04] border border-rose-500/15 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-rose-400 block mb-1 flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            <span>Categorically Defer / Eliminate</span>
                          </span>
                          <p className="text-slate-300">{strategy.decisionFilter.ignoreOrDefer}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-rose-500/10 text-[11px] text-slate-400">
                          <span className="text-amber-400 font-medium">Insight: </span>
                          <span>{strategy.insightBody}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Active Blueprint Tab */
            <div className="space-y-4">
              <div className="card-executive rounded-xl p-5 border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                      Primary Strategic Mission
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded">
                    {currentMission.estimatedMinutes} mins allocated
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{currentMission.title}</h3>
                <p className="text-xs text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  {currentMission.why}
                </p>
                <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Success Criteria: {currentMission.successCriteria}</span>
                </div>
              </div>

              {/* Active Decision Filter */}
              <div className="card-executive rounded-xl p-5 border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-400" />
                  <span className="text-[11px] font-mono uppercase text-indigo-400 font-bold">
                    Active Decision Filter
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block mb-1">
                      IF Condition
                    </span>
                    <p className="text-slate-300">{currentFilter.if}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-900/20 border border-indigo-500/20">
                    <span className="text-[10px] font-mono text-indigo-300 uppercase font-semibold block mb-1">
                      THEN Action
                    </span>
                    <p className="text-indigo-100">{currentFilter.then}</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <Ban className="w-3.5 h-3.5 shrink-0" />
                  <span>Defer: {currentFilter.ignoreOrDefer}</span>
                </div>
              </div>

              {/* Energy Advice */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">
                    Energy & Cognitive Sequencing Protocol
                  </span>
                  <p className="text-slate-400 leading-relaxed">{currentAdvice}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.01]">
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Press Esc or click outside to dismiss
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-semibold transition cursor-pointer ml-auto"
          >
            Close Strategy Suite
          </button>
        </div>
      </div>
    </div>
  );
};
