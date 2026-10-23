import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fsqcyxogerxutdyvgwhw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcWN5eG9nZXJ4dXRkeXZnd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NzMyMDcsImV4cCI6MjEwODM0OTIwN30.qo8VvCRJIQePO9VOIUBD6kJTAgeZGV9PbNwwYwrEfR0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
