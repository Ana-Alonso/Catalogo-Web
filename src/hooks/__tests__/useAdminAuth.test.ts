import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

const loadUseAdminAuth = async (useMocks: boolean, dev = true) => {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
  vi.stubEnv('VITE_USE_MOCKS', String(useMocks));
  vi.stubEnv('DEV', dev);
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

  it('rechaza la demo de una build de producción con mocks activados', async () => {
    const useAdminAuth = await loadUseAdminAuth(true, false);
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

const { setSessionMock, fetchMock, clientMock } = vi.hoisted(() => {
  const setSessionMock = vi.fn().mockResolvedValue({ error: null });
  const clientMock = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi
        .fn()
        .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      setSession: setSessionMock,
    },
  };
  return { setSessionMock, clientMock, fetchMock: vi.fn() };
});

const loadConfiguredHook = async () => {
  vi.resetModules();
  vi.doMock('../../utils/supabase', () => ({
    isSupabaseConfigured: true,
    isMockMode: false,
    supabase: clientMock,
  }));
  vi.stubGlobal('fetch', fetchMock);
  const mod = await import('../useAdminAuth');
  return mod.useAdminAuth;
};

describe('useAdminAuth con Supabase configurado', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.doUnmock('../../utils/supabase');
    setSessionMock.mockReset().mockResolvedValue({ error: null });
    fetchMock.mockReset();
  });

  it('canjea las credenciales por una sesión a través de la API', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'jwt', refresh_token: 'refresh' }), {
        status: 200,
      })
    );
    const useAdminAuth = await loadConfiguredHook();
    const { result } = renderHook(() => useAdminAuth());

    const outcome = await act(async () =>
      result.current.signIn('Ana@Example.com', 'una-clave')
    );

    expect(outcome.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin-session',
      expect.objectContaining({ method: 'POST' })
    );
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body ?? '{}')).toEqual({
      email: 'ana@example.com',
      password: 'una-clave',
    });
    expect(setSessionMock).toHaveBeenCalledWith({
      access_token: 'jwt',
      refresh_token: 'refresh',
    });
  });

  it('avisa del límite de intentos cuando la API responde 429', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'rateLimited' }), { status: 429 }));
    const useAdminAuth = await loadConfiguredHook();
    const { result } = renderHook(() => useAdminAuth());

    const outcome = await act(async () =>
      result.current.signIn('ana@example.com', 'una-clave')
    );

    expect(outcome).toEqual({ success: false, errorKey: 'admin.login.rateLimited' });
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it('distinge credenciales inválidas de un usuario que no es admin', async () => {
    const useAdminAuth = await loadConfiguredHook();
    const { result } = renderHook(() => useAdminAuth());

    fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'invalid' }), { status: 401 }));
    const rejected = await act(async () =>
      result.current.signIn('ana@example.com', 'mal')
    );
    expect(rejected.errorKey).toBe('admin.login.invalidCredentials');

    fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'notAdmin' }), { status: 403 }));
    const notAdmin = await act(async () =>
      result.current.signIn('ana@example.com', 'otra-clave')
    );
    expect(notAdmin.errorKey).toBe('admin.login.notAdmin');
  });
});
