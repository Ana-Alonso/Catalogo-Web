import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

export const createSupabaseAdmin = () => {
  const env = getSupabaseEnv();
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
