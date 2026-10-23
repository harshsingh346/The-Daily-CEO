import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Target,
  BarChart2,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DesignBackground } from '../components/layout/DesignBackground';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, continueAsDemoUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error: signUpErr } = await signUp(email, password, fullName);
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

  const handleDemoAccess = () => {
    continueAsDemoUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Luxury Design Background with Golden Light Flares */}
      <DesignBackground />

      {/* Main Auth Container Card matching reference image */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#0e1017]/95 border border-white/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative z-10 overflow-hidden flex flex-col">
        {/* Top Header of Card matching reference */}
        <div className="px-6 sm:px-8 py-5 border-b border-white/[0.06] flex items-center justify-between">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <path d="M10 6L18 3L18 33L10 30L6 18L10 6Z" fill="url(#goldLogo1)" />
                <path d="M18 3L26 6L30 18L26 30L18 33L18 3Z" fill="url(#goldLogo2)" />
                <path d="M14 12L18 9L22 12L24 18L22 24L18 27L14 24L12 18L14 12Z" fill="#0e1017" />
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
            <div>
              <div className="font-semibold text-sm text-slate-100 tracking-tight">
                The Daily CEO
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                Plan • Focus • Achieve
              </p>
            </div>
          </div>

          {/* Top Right Corner Switch Button matching reference */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              {isSignUp ? 'Already have an account?' : 'New here?'}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="px-3.5 py-1 rounded-full border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>{isSignUp ? 'Sign In' : 'Sign Up'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Split Two-Column Body matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 p-4 sm:p-6 lg:p-8 gap-6 lg:gap-10">
          {/* Left Column: Majestic Mountain Sunrise & Pillars */}
          <div className="relative rounded-2xl overflow-hidden min-h-[380px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
            {/* Background Mountain Photo */}
            <img
              src="/executive_sunrise.jpg"
              alt="Executive sunrise over mountain summit"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92]"
            />
            {/* Dark Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/75 pointer-events-none" />

            {/* Top Content */}
            <div className="relative z-10 space-y-2 max-w-md">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
                {isSignUp ? 'START YOUR JOURNEY' : 'WELCOME BACK'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {isSignUp ? (
                  <>
                    Build a Better <span className="text-gold-gradient">You.</span>
                  </>
                ) : (
                  <>
                    Your Goals <span className="text-gold-gradient">Matter.</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {isSignUp
                  ? 'Create your account and take the first step toward your goals, habits and dreams.'
                  : 'Sign in to your Daily CEO and continue building the life you want.'}
              </p>
            </div>

            {/* Bottom 3 Feature Highlights matching reference */}
            <div className="relative z-10 space-y-3.5 pt-6">
              {isSignUp ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Set Your Goals</h4>
                      <p className="text-[11px] text-slate-400">What do you want to achieve?</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Plan Your Day</h4>
                      <p className="text-[11px] text-slate-400">Turn goals into action steps.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Grow Every Day</h4>
                      <p className="text-[11px] text-slate-400">Track, improve, repeat.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Stay Focused</h4>
                      <p className="text-[11px] text-slate-400">Turn your goals into daily actions.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Track Progress</h4>
                      <p className="text-[11px] text-slate-400">See your growth, stay motivated.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Be Your Best</h4>
                      <p className="text-[11px] text-slate-400">Small steps. Big results.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Form matching reference */}
          <div className="flex flex-col justify-center py-2 px-1 sm:px-4 space-y-5">
            {/* Title & Subtitle */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                {isSignUp ? (
                  <>
                    <span>Create</span>
                    <span className="text-gold-gradient">Account</span>
                  </>
                ) : (
                  <>
                    <span>Sign</span>
                    <span className="text-gold-gradient">In</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp
                  ? "It's quick and easy. Get started today."
                  : 'Welcome back! Please enter your details to continue.'}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password row */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/[0.1] bg-black/40 accent-amber-500 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Solid Golden Button matching reference */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-semibold text-xs shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 mt-2"
              >
                <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Divider matching reference */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.07]" />
              </div>
              <div className="relative flex justify-center text-[10px] text-slate-400">
                <span className="bg-[#0e1017] px-3">or continue with</span>
              </div>
            </div>

            {/* Social Authentication Buttons matching reference */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-[#090b10] hover:bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200 transition cursor-pointer flex items-center justify-center gap-2.5"
              >
                {/* Google Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-[#090b10] hover:bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200 transition cursor-pointer flex items-center justify-center gap-2.5"
              >
                {/* Apple Logo SVG */}
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.83-11.69-14.36-5.87-9.46-10.49-20.2-13.88-32.22-3.38-12.02-5.08-23.23-5.08-33.64 0-14.57 3.59-26.63 10.77-36.17 7.18-9.54 16.03-14.42 26.54-14.64 5.33 0 11.03 1.35 17.11 4.05 6.08 2.7 10.05 4.11 11.91 4.22 1.52-.11 5.76-1.57 12.74-4.38 6.98-2.8 12.87-4.05 17.67-3.73 13.04.87 23.37 5.76 31 14.68-11.52 7.07-17.17 16.74-16.96 29.02.22 9.68 4.02 17.72 11.41 24.13 7.39 6.41 16.03 10.05 25.92 10.92-2.18 6.63-4.68 13.1-7.5 19.42zM119.22 33.15c0-7.39 2.66-14.35 7.98-20.87 5.32-6.52 11.85-10.87 19.57-13.04.22 1.52.33 3.04.33 4.56 0 7.39-2.77 14.45-8.31 21.19-5.54 6.74-12.17 11.19-19.89 13.36-.22-1.74-.33-3.48-.33-5.2z" />
                </svg>
                <span>Continue with Apple</span>
              </button>

              {/* Instant Evaluation Demo Workspace Button */}
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore in Instant Executive Demo Mode</span>
              </button>
            </div>

            {/* Bottom Footer Text */}
            <div className="pt-2 text-center text-[11px] text-slate-400">
              {isSignUp ? (
                <span>
                  By signing up, you agree to our{' '}
                  <span className="text-amber-400 hover:underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-amber-400 hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError(null);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Sign Up →
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
