import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, CornerDownLeft, Shield, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface CommandAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandAssistant: React.FC<CommandAssistantProps> = ({ isOpen, onClose }) => {
  const { activePlan, checkin } = useData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: "Chief of Staff active. I have your current mission, key moves, and constraints loaded. How can I assist your execution?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const nextMove = activePlan?.key_moves?.find((m) => m.status === 'pending');

  const quickPrompts = [
    { label: 'What should I do next?', query: 'What is my highest leverage next action right now?' },
    { label: 'Break down next move', query: 'Break down my next pending move into 3 small, executable steps.' },
    { label: 'I only have 15 minutes', query: 'I have an unexpected 15-minute gap. What micro-win should I tackle?' },
    { label: 'Summarize today', query: 'Give me an executive snapshot of my progress and focus.' },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('next action') || qLower.includes('do next')) {
        if (nextMove) {
          reply = `Focus exclusively on Key Move #${nextMove.priority}: "${nextMove.title}". It has an estimated budget of ${nextMove.estimated_minutes}m. Success criteria: ${nextMove.completionCriteria || 'Complete without multitasking.'}`;
        } else {
          reply = `All scheduled Key Moves for today are marked complete! Your primary mission is secured. Proceed to the Evening Review or close out your shutdown ritual.`;
        }
      } else if (qLower.includes('break down') || qLower.includes('3 small')) {
        if (nextMove) {
          reply = `Here is a friction-free 3-step breakdown for "${nextMove.title}":\n\n1. Isolate the canvas: open only the relevant file or document; close communication tabs.\n2. Execute the minimum verifiable core (first 10 minutes).\n3. Test or review output against success criteria and commit.`;
        } else {
          reply = `No pending moves currently in queue. You are clear for high-level strategic reflection.`;
        }
      } else if (qLower.includes('15 minutes') || qLower.includes('micro-win')) {
        reply = `With 15 minutes: do NOT check email. Instead, clear the immediate setup for Move #${nextMove?.priority || 1}, or organize your tomorrow morning notes. That protects your high-energy blocks.`;
      } else if (qLower.includes('summarize') || qLower.includes('snapshot')) {
        const completed = (activePlan?.key_moves || []).filter((m) => m.status === 'completed').length;
        const total = activePlan?.key_moves?.length || 0;
        reply = `Executive Summary:\n• Mission: ${activePlan?.primary_mission.title || 'In Check-in'}\n• Velocity: ${completed}/${total} Key Moves finished (${Math.round((completed / (total || 1)) * 100)}%)\n• Energy: ${checkin?.energy || 8}/10\n• Decision rule: Maintain zero-tolerance for context switching.`;
      } else {
        reply = `Chief of Staff guidance: Protect your cognitive bandwidth. Your primary focus remains "${activePlan?.primary_mission.title || 'executing top priority'}". Minimize surface area and maintain forward momentum.`;
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#10131d] border border-white/[0.1] rounded-xl max-w-xl w-full h-[580px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Talk to Your CEO
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Context
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Private, context-aware executive advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 border-b border-white/[0.05] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-indigo-600/20 border border-white/[0.06] hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 transition cursor-pointer shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[88%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 border border-white/[0.1]'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`p-3 rounded-xl text-xs whitespace-pre-wrap leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/[0.04] text-slate-200 border border-white/[0.06]'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 font-mono ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5 max-w-[80%] items-center text-xs text-slate-400 pl-8">
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span className="text-[11px] font-mono">Synthesizing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-black/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your chief of staff anything... (e.g. 'What next?')"
              className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
