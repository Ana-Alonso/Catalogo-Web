import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

const loadUseAdminAuth = async (useMocks: boolean) => {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
  vi.stubEnv('VITE_USE_MOCKS', String(useMocks));
  const mod = await import('../useAdminAuth');
  return mod.useAdminAuth;
};

describe('useAdminAuth sin Supabase configurado', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rechaza el acceso cuando los mocks no estan activados', async () => {
    const useAdminAuth = await loadUseAdminAuth(false);
    const { result } = renderHook(() => useAdminAuth());

    const outcome = await act(async () => result.current.signIn('a@b.co', 'clave'));

    expect(outcome.success).toBe(false);
    expect(outcome.errorKey).toBe('admin.login.authNotConfigured');
  });

  it('mantiene el acceso de demo cuando los mocks estan activados', async () => {
    const useAdminAuth = await loadUseAdminAuth(true);
    const { result } = renderHook(() => useAdminAuth());

    const outcome = await act(async () => result.current.signIn('a@b.co', 'clave'));

    expect(outcome.success).toBe(true);
  });
});
