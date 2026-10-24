import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Sparkles,
  BookOpen,
  Compass,
  Moon,
  BarChart3,
  Settings,
  LogOut,
  HelpCircle,
  Zap,
  User as UserIcon,
  CheckCircle2,
  ExternalLink,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { analyzePendingTasks } from '../../lib/reminderService';

interface ExecutiveHeaderProps {
  onOpenAssistant: () => void;
  onOpenHowToUse: () => void;
  onOpenGmailReminder?: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  onOpenAssistant,
  onOpenHowToUse,
  onOpenGmailReminder,
}) => {
  const navigate = useNavigate();
  const { profile, user, isGuest, signOut } = useAuth();
  const { activePlan } = useData();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setIsAlertsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsAlertsOpen(false);
      }
    }

    if (isUserMenuOpen || isAlertsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen, isAlertsOpen]);

  const userName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    (isGuest ? 'Alex Vance (Demo)' : 'Executive');

  const userInitial = (userName?.[0] || 'E').toUpperCase();
  const { goals, projects } = useData();
  const keyMoves = activePlan?.key_moves || [];
  const completedMoves = keyMoves.filter((m) => m.status === 'completed').length;
  const totalMoves = keyMoves.length || 3;

  const taskAnalysis = analyzePendingTasks(keyMoves, profile);
  const alertCount = taskAnalysis.missedTasks.length + (taskAnalysis.isOverCapacity ? 1 : 0);

  return (
    <header className="w-full pt-4 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Floating Rounded Navbar Container with Frosted Glass (overflow visible so dropdowns aren't clipped) */}
      <div className="h-16 rounded-2xl relative z-40 flex items-center justify-between px-4 sm:px-6 shadow-2xl">
        {/* Glass specular background layer with shine confined internally */}
        <div className="absolute inset-0 rounded-2xl card-ceo pointer-events-none -z-10" />
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          {/* Golden Geometric Emblem matching reference */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <path
                d="M10 6L18 3L18 33L10 30L6 18L10 6Z"
                fill="url(#goldLogo1)"
              />
              <path
                d="M18 3L26 6L30 18L26 30L18 33L18 3Z"
                fill="url(#goldLogo2)"
              />
              <path
                d="M14 12L18 9L22 12L24 18L22 24L18 27L14 24L12 18L14 12Z"
                fill="#0c0e14"
              />
              <defs>
                <linearGradient id="goldLogo1" x1="6" y1="3" x2="18" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fef08a" />
                  <stop offset="0.5" stopColor="#f59e0b" />
                  <stop offset="1" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="goldLogo2" x1="18" y1="3" x2="30" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fbbf24" />
                  <stop offset="0.5" stopColor="#d97706" />
                  <stop offset="1" stopColor="#78350f" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <span className="font-semibold text-sm sm:text-base text-slate-100 tracking-tight">
            The Daily CEO
          </span>
        </div>

        {/* Center Navigation Links matching reference */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative px-3.5 py-1.5 text-xs font-medium transition duration-150 ${
                isActive ? 'text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Overview</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/checkin"
            className={({ isActive }) =>
              `relative px-3.5 py-1.5 text-xs font-medium transition duration-150 ${
                isActive ? 'text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Planner</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `relative px-3.5 py-1.5 text-xs font-medium transition duration-150 ${
                isActive ? 'text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Projects</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/goals"
            className={({ isActive }) =>
              `relative px-3.5 py-1.5 text-xs font-medium transition duration-150 ${
                isActive ? 'text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Goals</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <button
            onClick={onOpenAssistant}
            className="relative px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
          >
            <span>AI Coach</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </button>

          {/* Quick How to Use Tab */}
          <button
            onClick={onOpenHowToUse}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400/80" />
            <span>How to Use</span>
          </button>
        </nav>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Sign In button when in guest mode */}
          {isGuest && (
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-medium transition cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Notification Bell with Amber/Rose Alert Badge and Quick Dropdown */}
          <div className="relative" ref={alertsRef}>
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              aria-expanded={isAlertsOpen}
              className={`w-9 h-9 rounded-full flex items-center justify-center relative transition cursor-pointer ${
                isAlertsOpen
                  ? 'bg-white/[0.1] border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] text-amber-300'
                  : alertCount > 0
                  ? 'bg-rose-500/10 border border-rose-500/40 hover:border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                  : 'bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/30 text-slate-300'
              }`}
              aria-label="Executive Task Alerts"
              title={alertCount > 0 ? `${alertCount} task alert(s) pending` : 'Executive Notifications'}
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#0c0e14] shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse">
                  {alertCount}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0c0e14] shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              )}
            </button>

            {/* Alerts Dropdown */}
            {isAlertsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#0e121b]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.1)] p-3.5 z-50 animate-fade-in text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Bell className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-semibold text-slate-100">Executive Task Monitor</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {alertCount > 0 ? (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Action Required: Attention Needed</span>
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {taskAnalysis.missedTasks.length > 0 && (
                        <li>
                          <strong className="text-rose-300">{taskAnalysis.missedTasks.length} task(s)</strong> have passed their scheduled slot.
                        </li>
                      )}
                      {taskAnalysis.isOverCapacity && (
                        <li>
                          Workday capacity alert: <strong className="text-amber-300">{taskAnalysis.totalPendingMinutes}m</strong> pending vs only <strong className="text-amber-300">{taskAnalysis.remainingMinutesInWorkday}m</strong> remaining.
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Execution On Schedule</span>
                    </div>
                    <p className="text-slate-400 text-[10px]">
                      {taskAnalysis.pendingTasks.length} pending task(s) currently within executive parameters.
                    </p>
                  </div>
                )}

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsAlertsOpen(false);
                      onOpenGmailReminder?.();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.3)] cursor-pointer transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Reminder to Gmail</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAlertsOpen(false);
                      onOpenAssistant();
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-slate-100 font-medium text-xs flex items-center justify-center gap-1.5 border border-white/[0.08] cursor-pointer transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ask Chief of Staff AI</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-expanded={isUserMenuOpen}
              className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full transition cursor-pointer select-none border ${
                isUserMenuOpen
                  ? 'bg-white/[0.1] border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-amber-500/30'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-white shadow-inner overflow-hidden border border-amber-300/40">
                <span>{userInitial}</span>
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline capitalize">
                {userName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#0e121b]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.08)] py-2.5 z-50 animate-fade-in text-xs">
                {/* Profile Card Header (Clickable to go to Settings) */}
                <div
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="px-3.5 py-3 border-b border-white/[0.08] space-y-1.5 hover:bg-white/[0.03] transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-white shadow-inner border border-amber-300/40">
                        {userInitial}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 truncate text-sm capitalize group-hover:text-amber-300 transition">
                          {userName}
                        </p>
                        <p className="text-[11px] text-amber-300/90 truncate font-mono">
                          {isGuest ? 'Demo Workspace' : user?.email}
                        </p>
                      </div>
                    </div>
                    {!isGuest && user ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-medium">
                        Sandbox
                      </span>
                    )}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isGuest ? 'Instant Sandbox Mode' : 'Supabase Cloud Synced'}</span>
                    </div>
                    <span className="text-amber-400/90 group-hover:text-amber-300 flex items-center gap-0.5">
                      Edit Profile &rarr;
                    </span>
                  </div>
                </div>

                {/* Live User Data Quick Stats */}
                <div className="px-3 py-2 bg-white/[0.02] border-b border-white/[0.06] grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-1 rounded bg-black/40 border border-white/[0.04]">
                    <div className="text-amber-400 font-bold text-xs">{goals.length}</div>
                    <div className="text-slate-400">Goals</div>
                  </div>
                  <div className="p-1 rounded bg-black/40 border border-white/[0.04]">
                    <div className="text-amber-400 font-bold text-xs">{projects.length}</div>
                    <div className="text-slate-400">Projects</div>
                  </div>
                  <div className="p-1 rounded bg-black/40 border border-white/[0.04]">
                    <div className="text-amber-400 font-bold text-xs">{completedMoves}/{totalMoves}</div>
                    <div className="text-slate-400">Priorities</div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-200 hover:text-white hover:bg-amber-500/10 flex items-center gap-2.5 font-medium transition"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    <span>Executive Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/projects');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2.5 transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Active Projects ({projects.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/goals');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2.5 transition"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Executive Goals ({goals.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/journal');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>CEO Strategic Journal</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/decision-room');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2.5 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Decision Room</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/review');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2.5 transition"
                  >
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Evening Executive Review</span>
                  </button>
                </div>

                <div className="pt-1.5 border-t border-white/[0.06] px-2">
                  {isGuest ? (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full px-3 py-2 text-left text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl flex items-center gap-2 font-medium transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sign In to Executive Account</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await signOut();
                        navigate('/login');
                      }}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
