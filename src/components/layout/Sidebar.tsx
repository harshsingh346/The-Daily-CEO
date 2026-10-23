import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Target,
  Compass,
  History,
  Moon,
  BarChart3,
  Settings,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  onOpenAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAssistant }) => {
  const { profile, isGuest, user } = useAuth();
  const { activePlan } = useData();

  const completedMoves = (activePlan?.key_moves || []).filter(m => m.status === 'completed').length;
  const totalMoves = activePlan?.key_moves?.length || 0;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/checkin', label: 'Daily Check-in', icon: Sparkles, badge: !activePlan ? 'Action' : undefined },
    { to: '/journal', label: 'CEO Journal', icon: BookOpen },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/decision-room', label: 'Decision Room', icon: Compass },
    { to: '/history', label: 'Daily History', icon: History },
    { to: '/review', label: 'Evening Review', icon: Moon },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#0c0e14] flex flex-col h-screen select-none shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold shadow-inner">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
              The Daily CEO
              <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Chief of Staff OS</p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {isGuest ? 'Demo Workspace' : 'Supabase Synced'}
          </span>
          {totalMoves > 0 && (
            <span className="font-mono text-slate-300 text-[10px]">
              {completedMoves}/{totalMoves} moves
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Action: Talk to CEO */}
      <div className="px-3 pb-3">
        <button
          onClick={onOpenAssistant}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-white/[0.08] hover:border-indigo-500/30 transition text-xs font-medium cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span>Talk to Your CEO</span>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">⌘K</span>
        </button>
      </div>

      {/* Executive User Footer */}
      <div className="p-3 border-t border-white/[0.08] bg-black/20">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/[0.1] flex items-center justify-center text-xs font-medium text-slate-300 uppercase">
            {(profile?.display_name || user?.email || 'E')[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-200 truncate">
              {profile?.display_name || user?.email || 'Chief Executive'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {profile?.timezone || 'Local Time'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
