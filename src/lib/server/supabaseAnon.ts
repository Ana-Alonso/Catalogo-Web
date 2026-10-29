import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

export const createSupabaseAnon = () => {
  const env = getSupabaseEnv();
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
