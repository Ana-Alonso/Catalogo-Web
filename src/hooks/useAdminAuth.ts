import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, isMockAuthEnabled } from '../utils/supabase';
import { isAdminUser } from '../utils/adminAccess';

interface SignInResult {
  success: boolean;
  errorKey?:
    | 'admin.login.invalidCredentials'
    | 'admin.login.notAdmin'
    | 'admin.login.authNotConfigured'
    | 'admin.login.rateLimited';
}

interface SessionPayload {
  access_token?: string;
  refresh_token?: string;
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
        if (isMockAuthEnabled) {
          return { success: true };
        }
        return { success: false, errorKey: 'admin.login.authNotConfigured' };
      }

      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch('/api/admin-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      }).catch(() => null);

      if (!response) {
        return { success: false };
      }

      if (response.status === 429) {
        return { success: false, errorKey: 'admin.login.rateLimited' };
      }

      if (response.status === 403) {
        return { success: false, errorKey: 'admin.login.notAdmin' };
      }

      if (response.status === 400 || response.status === 401) {
        return { success: false, errorKey: 'admin.login.invalidCredentials' };
      }

      if (!response.ok) {
        return { success: false };
      }

      const session = (await response.json().catch(() => null)) as SessionPayload | null;

      if (!session?.access_token || !session.refresh_token) {
        return { success: false };
      }

      const { error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (error) {
        return { success: false };
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
