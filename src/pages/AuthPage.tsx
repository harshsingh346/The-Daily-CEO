import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  RefreshCw,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DesignBackground } from '../components/layout/DesignBackground';

type AuthView = 'signin' | 'signup' | 'confirm_gmail' | 'forgot_password' | 'update_password';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    signIn,
    signUp,
    resendConfirmationEmail,
    verifyOtp,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    continueAsDemoUser,
    user,
    isGuest,
  } = useAuth();

  const [view, setView] = useState<AuthView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New Password State (for recovery)
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Gmail Confirmation State
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [unconfirmedEmailPrompt, setUnconfirmedEmailPrompt] = useState(false);
  const [existingUserPrompt, setExistingUserPrompt] = useState(false);

  // Check URL hash / queries for verification or reset
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash.includes('type=recovery')) {
      setView('update_password');
      setSuccessMsg('Reset authorization confirmed. Enter your new password below.');
      return;
    }

    if (hash.includes('access_token') || search.includes('code')) {
      setSuccessMsg('Email confirmed successfully! Initializing your Executive Dashboard...');
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // If already authenticated with real account, redirect to dashboard (unless setting new password)
  useEffect(() => {
    if (user && !isGuest && view !== 'update_password') {
      navigate('/');
    }
  }, [user, isGuest, navigate, view]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setUnconfirmedEmailPrompt(false);
    setExistingUserPrompt(false);

    if (view === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      setLoading(true);
      try {
        const { error: signUpErr, requiresEmailConfirmation, userAlreadyExists } = await signUp(
          email,
          password,
          fullName
        );

        if (userAlreadyExists) {
          setExistingUserPrompt(true);
          setPendingEmail(email);
          setError(
            `An account with ${email} is already registered. Please sign in with your password, or click "Reset Password" if you forgot it.`
          );
        } else if (signUpErr) {
          setError(signUpErr.message);
        } else if (requiresEmailConfirmation) {
          setPendingEmail(email);
          setResendCooldown(60);
          setView('confirm_gmail');
          setSuccessMsg(`Confirmation email sent to ${email}. Check your Gmail inbox!`);
        } else {
          setSuccessMsg('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        }
      } finally {
        setLoading(false);
      }
    } else if (view === 'signin') {
      setLoading(true);
      try {
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) {
          const msg = signInErr.message || '';
          if (msg.toLowerCase().includes('not confirmed') || msg.toLowerCase().includes('email')) {
            setUnconfirmedEmailPrompt(true);
            setPendingEmail(email);
            setError('Your Gmail address has not been confirmed yet.');
          } else if (msg.toLowerCase().includes('invalid login credentials')) {
            setError('Invalid email or password. Please verify your credentials or create an account.');
          } else {
            setError(msg);
          }
        } else {
          setSuccessMsg('Signed in successfully! Loading executive command center...');
          setTimeout(() => navigate('/'), 800);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0) return;
    const targetEmail = pendingEmail || email;
    if (!targetEmail) {
      setError('Please provide your Gmail address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: resendErr } = await resendConfirmationEmail(targetEmail);
      if (resendErr) {
        setError(resendErr.message);
      } else {
        setResendCooldown(60);
        setSuccessMsg(`A fresh verification email has been dispatched to ${targetEmail}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim()) {
      setError('Please enter the 6-digit confirmation code from your Gmail.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: verifyErr } = await verifyOtp(pendingEmail || email, otpToken.trim());
      if (verifyErr) {
        setError(verifyErr.message || 'Invalid or expired code. Please check your Gmail or click resend.');
      } else {
        setSuccessMsg('Email verified successfully! Welcome to The Daily CEO.');
        setTimeout(() => navigate('/'), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your Gmail address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: resetErr } = await resetPassword(forgotEmail);
      if (resetErr) {
        setError(resetErr.message);
      } else {
        setForgotSuccess(true);
        setSuccessMsg(`Password reset instructions dispatched to ${forgotEmail}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const { error: googleErr } = await signInWithGoogle();
    if (googleErr) {
      // If Google provider is not configured in Supabase console, inform user gracefully
      setError(
        googleErr.message ||
          'Google OAuth requires provider setup in Supabase. You can sign up with your Gmail and password directly!'
      );
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: updateErr } = await updatePassword(newPassword);
      if (updateErr) {
        setError(updateErr.message);
      } else {
        setSuccessMsg('Password updated successfully! Welcome to The Daily CEO.');
        setTimeout(() => navigate('/'), 1200);
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

      {/* Main Auth Container Card */}
      <div className="w-full max-w-5xl rounded-3xl card-ceo backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.25] shadow-[0_25px_80px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] relative z-10 overflow-hidden flex flex-col">
        {/* Top Header of Card */}
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
              <div className="font-semibold text-sm text-slate-100 tracking-tight">The Daily CEO</div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">Plan • Focus • Achieve</p>
            </div>
          </div>

          {/* Top Right Corner Switch Button */}
          <div className="flex items-center gap-2 text-xs">
            {view === 'confirm_gmail' ? (
              <button
                onClick={() => {
                  setView('signin');
                  setError(null);
                }}
                className="px-3.5 py-1 rounded-full border border-white/[0.1] hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            ) : view === 'forgot_password' ? (
              <button
                onClick={() => {
                  setView('signin');
                  setError(null);
                }}
                className="px-3.5 py-1 rounded-full border border-white/[0.1] hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            ) : (
              <>
                <span className="text-slate-400 hidden sm:inline">
                  {view === 'signup' ? 'Already have an account?' : 'New here?'}
                </span>
                <button
                  onClick={() => {
                    setView(view === 'signup' ? 'signin' : 'signup');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="px-3.5 py-1 rounded-full border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>{view === 'signup' ? 'Sign In' : 'Sign Up'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Split Two-Column Body */}
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
                {view === 'confirm_gmail'
                  ? 'GMAIL VERIFICATION'
                  : view === 'forgot_password'
                  ? 'ACCOUNT RECOVERY'
                  : view === 'signup'
                  ? 'START YOUR JOURNEY'
                  : 'WELCOME BACK'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {view === 'confirm_gmail' ? (
                  <>
                    Confirm Your <span className="text-gold-gradient">Gmail.</span>
                  </>
                ) : view === 'forgot_password' ? (
                  <>
                    Reset Your <span className="text-gold-gradient">Password.</span>
                  </>
                ) : view === 'signup' ? (
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
                {view === 'confirm_gmail'
                  ? 'Check your Gmail inbox to activate your executive access.'
                  : view === 'forgot_password'
                  ? 'Receive a direct recovery link sent to your registered Gmail address.'
                  : view === 'signup'
                  ? 'Create your account and take the first step toward your goals, habits and dreams.'
                  : 'Sign in to your Daily CEO and continue building the life you want.'}
              </p>
            </div>

            {/* Bottom 3 Feature Highlights */}
            <div className="relative z-10 space-y-3.5 pt-6">
              {view === 'confirm_gmail' ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Gmail Delivered</h4>
                      <p className="text-[11px] text-slate-400">Confirmation dispatched to your inbox.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">One-Click Activation</h4>
                      <p className="text-[11px] text-slate-400">Click the link or paste the 6-digit code.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Full Executive Access</h4>
                      <p className="text-[11px] text-slate-400">Unlocks AI coaching, goals & momentum.</p>
                    </div>
                  </div>
                </>
              ) : view === 'signup' ? (
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

          {/* Right Column: Dynamic Form Area */}
          <div className="flex flex-col justify-center py-2 px-1 sm:px-4 space-y-5">
            {/* Notification Alerts */}
            {existingUserPrompt && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2.5 animate-fade-in shadow-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-100">Account Already Registered</span>
                </div>
                <p className="text-slate-300">
                  An account with <span className="font-mono text-amber-300 font-semibold">{pendingEmail || email}</span> already exists and is active. You do not need to sign up again!
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setView('signin');
                      setError(null);
                      setExistingUserPrompt(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition cursor-pointer"
                  >
                    Sign In to Account →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(pendingEmail || email);
                      setView('forgot_password');
                      setError(null);
                      setExistingUserPrompt(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs transition cursor-pointer"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            )}

            {error && !existingUserPrompt && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1">
                  <p>{error}</p>
                  {unconfirmedEmailPrompt && (
                    <button
                      type="button"
                      onClick={() => {
                        handleResendConfirmation();
                        setView('confirm_gmail');
                      }}
                      className="inline-flex items-center gap-1.5 text-amber-300 font-semibold underline hover:text-amber-200 mt-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send confirmation link to Gmail now →</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* VIEW 1: GMAIL CONFIRMATION SCREEN */}
            {view === 'confirm_gmail' && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Check Your Gmail</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
                    Verify Your <span className="text-gold-gradient">Account</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    We sent an activation link to your email address:
                  </p>
                  <div className="mt-2 inline-block px-3.5 py-1.5 rounded-xl bg-[#090b10] border border-amber-500/30 font-mono text-xs text-amber-300 font-semibold">
                    {pendingEmail || email}
                  </div>
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-2xl bg-[#090b10] border border-white/[0.08] space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>Open your Gmail inbox (or Spam / Junk folder)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>Click the <strong className="text-amber-300">"Confirm your mail"</strong> link to log in directly</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <span>Or enter the 6-digit confirmation code below (if provided)</span>
                  </div>
                </div>

                {/* Direct Button: Open Gmail */}
                <button
                  type="button"
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="w-full py-3 px-4 rounded-xl bg-[#1a1e29] hover:bg-[#222735] border border-white/[0.1] text-xs font-semibold text-slate-100 transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {/* Gmail Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
                  <span>Open Gmail Inbox</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* OTP Code Form */}
                <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                      Enter 6-Digit Confirmation Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value)}
                        placeholder="e.g. 123456"
                        maxLength={8}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-sm font-mono tracking-widest text-slate-100 placeholder-slate-500 focus:border-amber-500 transition text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !otpToken.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-semibold text-xs shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>{loading ? 'Verifying Code...' : 'Verify & Enter Command Center'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>

                {/* Resend & Back controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.06] text-xs">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendCooldown > 0 || loading}
                    className="text-amber-400 hover:text-amber-300 disabled:text-slate-500 font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendCooldown > 0
                        ? `Resend available in ${resendCooldown}s`
                        : 'Resend confirmation to Gmail'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setView('signin');
                      setError(null);
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: FORGOT PASSWORD */}
            {view === 'forgot_password' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                    <span>Reset</span>
                    <span className="text-gold-gradient">Password</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your Gmail address to receive secure reset instructions.
                  </p>
                </div>

                {!forgotSuccess ? (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                    <div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Registered Gmail address"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-semibold text-xs shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>{loading ? 'Sending Reset Link...' : 'Send Reset Link to Gmail'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
                    <p className="font-semibold">Reset Email Sent</p>
                    <p className="text-slate-300">
                      Check your inbox at <span className="font-mono text-white">{forgotEmail}</span> for the password reset link.
                    </p>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('signin');
                      setError(null);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    ← Return to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: UPDATE PASSWORD (AFTER RECOVERY LINK) */}
            {view === 'update_password' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                    <span>Create New</span>
                    <span className="text-gold-gradient">Password</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your recovery link has been verified. Choose a new secure password for your account.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-semibold text-xs shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 mt-2"
                  >
                    <span>{loading ? 'Saving New Password...' : 'Save Password & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              </div>
            )}

            {/* VIEW 3: SIGN IN & SIGN UP FORMS */}
            {(view === 'signin' || view === 'signup') && (
              <>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                    {view === 'signup' ? (
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
                    {view === 'signup'
                      ? 'Sign up with your Gmail to get full executive sync.'
                      : 'Welcome back! Please enter your details to continue.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {view === 'signup' && (
                    <div>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full name (e.g. Alex Vance)"
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
                        placeholder="Gmail or work email address"
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
                        placeholder="Password (minimum 6 characters)"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-400 focus:border-amber-500 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {view === 'signup' && (
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
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password row */}
                  {view === 'signin' && (
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
                        onClick={() => {
                          setForgotEmail(email);
                          setView('forgot_password');
                          setError(null);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Solid Golden Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-semibold text-xs shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 mt-2"
                  >
                    <span>
                      {loading
                        ? 'Authenticating...'
                        : view === 'signup'
                        ? 'Sign Up & Send Gmail Confirmation'
                        : 'Sign In'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.07]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] text-slate-400">
                    <span className="bg-[#0e1017] px-3">or continue with</span>
                  </div>
                </div>

                {/* Social Authentication & Demo */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
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
                  {view === 'signup' ? (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setView('signin');
                          setError(null);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        Sign In →
                      </button>
                    </span>
                  ) : (
                    <span>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setView('signup');
                          setError(null);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        Sign Up with Gmail →
                      </button>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
