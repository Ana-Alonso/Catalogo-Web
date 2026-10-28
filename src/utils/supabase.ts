import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const isMockMode = useMocks;

export const isSupabaseConfigured = Boolean(
  !useMocks && supabaseUrl && supabaseAnonKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
