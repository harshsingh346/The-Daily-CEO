import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BookOpen, Target, Moon } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/checkin', label: 'Check-in', icon: Sparkles },
    { to: '/journal', label: 'Journal', icon: BookOpen },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/review', label: 'Review', icon: Moon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0c0e14]/95 backdrop-blur-md border-t border-white/[0.08] flex items-center justify-around z-40 px-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
