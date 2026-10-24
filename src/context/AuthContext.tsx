import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ error: Error | null; data?: any; requiresEmailConfirmation?: boolean }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: Error | null; data?: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null; data?: any }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsDemoUser: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'sample-user',
  app_metadata: {},
  user_metadata: { full_name: 'Alex Vance (Chief Executive)' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const DEMO_PROFILE: Profile = {
  id: 'sample-user',
  display_name: 'Alex Vance',
  timezone: 'Asia/Kolkata',
  preferences: {
    work_start_hour: 9,
    work_end_hour: 18,
    default_break_minutes: 10,
    ai_provider: 'builtin',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('the_daily_ceo_mode') === 'demo';
  });

  useEffect(() => {
    // 1. If explicitly in demo mode:
    const storedMode = localStorage.getItem('the_daily_ceo_mode');
    if (storedMode === 'demo') {
      setIsGuest(true);
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setIsLoading(false);
      return;
    }

    // 2. Check active Supabase auth session:
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          setIsGuest(false);
          fetchOrCreateProfile(initialSession.user);
        } else {
          // If no active session, start on login page (do not default to demo mode)
          setIsGuest(false);
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Auth session check fallback:', err);
        setIsGuest(false);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      });

    // 3. Listen to auth state events (including email confirmation redirect, login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
        sessionStorage.removeItem('the_daily_ceo_logged_out');
        await fetchOrCreateProfile(currentSession.user);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchOrCreateProfile(currentUser: User) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile:', error);
      }

      if (data) {
        setProfile(data as Profile);
      } else {
        // Upsert default profile
        const newProfile: Partial<Profile> = {
          id: currentUser.id,
          display_name:
            currentUser.user_metadata?.full_name ||
            currentUser.email?.split('@')[0] ||
            'Executive',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
          preferences: {},
        };
        const { data: inserted } = await supabase
          .from('profiles')
          .upsert(newProfile)
          .select()
          .single();
        if (inserted) setProfile(inserted as Profile);
      }
    } catch (err) {
      console.warn('Profile fetch exception:', err);
    }
  }

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!error && data?.session) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
        sessionStorage.removeItem('the_daily_ceo_logged_out');
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          await fetchOrCreateProfile(data.user);
        }
      }
      setIsLoading(false);
      return { error, data };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err, data: null };
    }
  }

  async function signUp(email: string, password: string, displayName?: string) {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: displayName?.trim() || email.split('@')[0],
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { error, data: null, requiresEmailConfirmation: false };
      }

      // If Supabase has email confirmation enabled, data.user is created but data.session is null
      const requiresEmailConfirmation = Boolean(data?.user && !data?.session);

      if (!requiresEmailConfirmation && data?.session) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
        sessionStorage.removeItem('the_daily_ceo_logged_out');
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          await fetchOrCreateProfile(data.user);
        }
      }

      setIsLoading(false);
      return { error: null, data, requiresEmailConfirmation };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err, data: null, requiresEmailConfirmation: false };
    }
  }

  async function resendConfirmationEmail(email: string) {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      return { error, data };
    } catch (err: any) {
      return { error: err, data: null };
    }
  }

  async function verifyOtp(email: string, token: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'signup',
      });

      if (!error && data?.session) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
        sessionStorage.removeItem('the_daily_ceo_logged_out');
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          await fetchOrCreateProfile(data.user);
        }
      }
      setIsLoading(false);
      return { error, data };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err, data: null };
    }
  }

  async function resetPassword(email: string) {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }

  async function signInWithGoogle() {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }

  async function signOut() {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    localStorage.removeItem('the_daily_ceo_mode');
    sessionStorage.setItem('the_daily_ceo_logged_out', 'true');
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsGuest(false);
    setIsLoading(false);
  }

  function continueAsDemoUser() {
    localStorage.setItem('the_daily_ceo_mode', 'demo');
    sessionStorage.removeItem('the_daily_ceo_logged_out');
    setIsGuest(true);
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!profile) return;
    const merged = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(merged);
    if (!isGuest && user) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isGuest,
        signIn,
        signUp,
        resendConfirmationEmail,
        verifyOtp,
        resetPassword,
        signInWithGoogle,
        signOut,
        continueAsDemoUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
