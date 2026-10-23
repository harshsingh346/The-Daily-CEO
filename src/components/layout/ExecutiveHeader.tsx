import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface ExecutiveHeaderProps {
  onOpenAssistant: () => void;
  onOpenHowToUse: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  onOpenAssistant,
  onOpenHowToUse,
}) => {
  const navigate = useNavigate();
  const { profile, user, isGuest, signOut } = useAuth();
  const { activePlan } = useData();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userName = profile?.display_name || user?.user_metadata?.full_name || 'Harsh Singh';

  return (
    <header className="w-full pt-4 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Floating Rounded Navbar Container matching reference image */}
      <div className="h-16 rounded-2xl bg-[#0c0e14]/90 backdrop-blur-md border border-white/[0.08] px-4 sm:px-6 flex items-center justify-between shadow-2xl relative z-40">
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

          {/* Notification Bell with Amber Dot matching reference */}
          <button
            onClick={onOpenAssistant}
            className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/30 flex items-center justify-center text-slate-300 relative transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0c0e14] shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
          </button>

          {/* User Profile Pill matching reference */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] transition cursor-pointer select-none"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-semibold text-white shadow-inner overflow-hidden border border-amber-300/30">
                {/* Fallback initial or photo representation */}
                <span>{userName[0]}</span>
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {userName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12151d] border border-white/[0.1] shadow-2xl py-2 z-50 animate-fade-in text-xs">
                <div className="px-3 py-2 border-b border-white/[0.06]">
                  <p className="font-semibold text-slate-100 truncate">{userName}</p>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {isGuest ? 'Demo Workspace' : user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/journal');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>CEO Journal</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/decision-room');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>Decision Room</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/review');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Evening Review</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/insights');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evidence Insights</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings & Sync</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-white/[0.06] px-1">
                  {isGuest ? (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full px-3 py-2 text-left text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sign In with Gmail</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await signOut();
                        navigate('/login');
                      }}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
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
