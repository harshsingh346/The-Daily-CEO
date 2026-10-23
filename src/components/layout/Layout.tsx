import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ExecutiveHeader } from './ExecutiveHeader';
import { CommandAssistant } from '../talk/CommandAssistant';
import { HowToUseSection } from '../common/HowToUseSection';

export const Layout: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

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
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans antialiased flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Floating Executive Header matching reference image */}
      <ExecutiveHeader
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenHowToUse={() => setIsHowToUseOpen(true)}
      />

      {/* Main App Page Body */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Modals */}
      <CommandAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      {isHowToUseOpen && (
        <HowToUseSection isModal onClose={() => setIsHowToUseOpen(false)} />
      )}
    </div>
  );
};
