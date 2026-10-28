import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { isAdminUser } from '../utils/adminAccess';

interface SignInResult {
  success: boolean;
  errorKey?: 'admin.login.invalidCredentials' | 'admin.login.notAdmin';
}

interface UseAdminAuthReturn {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let isActive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isActive) {
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isActive) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      if (!isSupabaseConfigured || !supabase) {
        return { success: true };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, errorKey: 'admin.login.invalidCredentials' };
      }

      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut();
        return { success: false, errorKey: 'admin.login.notAdmin' };
      }

      return { success: true };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }
    await supabase.auth.signOut();
  }, []);

  const isAdmin = isAdminUser(user);

  return { user, isAdmin, isLoading, signIn, signOut };
};
