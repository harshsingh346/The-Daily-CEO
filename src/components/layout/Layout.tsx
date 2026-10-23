import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { ReplanModal } from '../dashboard/ReplanModal';
import { CommandAssistant } from '../talk/CommandAssistant';

export const Layout: React.FC = () => {
  const [isReplanOpen, setIsReplanOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global keyboard shortcuts (⌘K or Ctrl+K for assistant)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAssistantOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#090a0f] text-slate-100 font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenAssistant={() => setIsAssistantOpen(true)} />
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenReplan={() => setIsReplanOpen(true)}
          onToggleMobileNav={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>

        <MobileNav />
      </div>

      {/* Modals & Overlays */}
      <ReplanModal isOpen={isReplanOpen} onClose={() => setIsReplanOpen(false)} />
      <CommandAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
};
