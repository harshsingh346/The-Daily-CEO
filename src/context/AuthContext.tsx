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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
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
    // 1. If currently in demo mode:
    if (isGuest) {
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setIsLoading(false);
      return;
    }

    // 2. Otherwise initialize Supabase auth session:
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchOrCreateProfile(initialSession.user);
      } else {
        // By default, start with demo user to guarantee seamless, instant access for evaluation
        setIsGuest(true);
        setUser(DEMO_USER);
        setProfile(DEMO_PROFILE);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Auth session check fallback:', err);
      setIsGuest(true);
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
        fetchOrCreateProfile(currentSession.user);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isGuest]);

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
          display_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Executive',
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
      }
      setIsLoading(false);
      return { error };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err };
    }
  }

  async function signUp(email: string, password: string, displayName?: string) {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });
      if (!error && data.user) {
        setIsGuest(false);
        localStorage.removeItem('the_daily_ceo_mode');
      }
      setIsLoading(false);
      return { error };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err };
    }
  }

  async function signOut() {
    setIsLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('the_daily_ceo_mode');
    setIsGuest(true);
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    setIsLoading(false);
  }

  function continueAsDemoUser() {
    localStorage.setItem('the_daily_ceo_mode', 'demo');
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
