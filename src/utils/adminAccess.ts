import type { User } from '@supabase/supabase-js';

const readRole = (metadata: unknown): unknown => {
  if (typeof metadata !== 'object' || metadata === null) {
    return undefined;
  }

  return (metadata as Record<string, unknown>).role;
};

export const isAdminUser = (user: User | null): boolean => {
  if (!user) {
    return false;
  }

  return readRole(user.app_metadata) === 'admin';
};
