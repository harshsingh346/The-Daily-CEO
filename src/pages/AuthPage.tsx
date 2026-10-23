import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, Shield, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, continueAsDemoUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpErr } = await signUp(email, password, displayName);
        if (signUpErr) {
          setError(signUpErr.message);
        } else {
          setSuccessMsg('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        }
      } else {
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) {
          setError(signInErr.message);
        } else {
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    continueAsDemoUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-4">
      {/* Background radial gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08)_0%,_transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            The Daily CEO
          </h1>
          <p className="text-xs text-slate-400">
            Personal Chief of Staff & Executive Operating System
          </p>
        </div>

        {/* Card */}
        <div className="card-executive rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-5">
          <div className="text-center pb-2">
            <h2 className="text-base font-semibold text-slate-100">
              {isSignUp ? 'Create Executive Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSignUp ? 'Get your personalized AI chief of staff' : 'Sign in to access your saved daily strategy'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executive@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#11141e] px-2 text-slate-500">Fast Hackathon Evaluation</span>
            </div>
          </div>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemo}
            className="w-full py-2.5 px-4 rounded-lg bg-white/[0.03] hover:bg-indigo-600/20 text-slate-200 hover:text-indigo-200 border border-white/[0.08] hover:border-indigo-500/30 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Explore as Executive Guest (Instant Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
