import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from './useAdminAuth';
import { isMockAuthEnabled } from '../utils/supabase';

export const useAdminSession = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading, signIn, signOut } = useAdminAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = isMockAuthEnabled || (user !== null && isAdmin);

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    setAuthError(
      result.success ? null : t(result.errorKey ?? 'admin.login.unknownError')
    );
  };

  const handleLogout = () => {
    void signOut();
  };

  return { isLoading, isAuthenticated, authError, handleLogin, handleLogout };
};
