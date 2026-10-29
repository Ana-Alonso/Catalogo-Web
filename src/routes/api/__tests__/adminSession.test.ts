import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { signInMock, consumeRateLimitMock, envMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
  consumeRateLimitMock: vi.fn(),
  envMock: {
    supabaseUrl: 'https://example.supabase.co',
    supabaseServiceRoleKey: 'service-role-key',
    supabaseAnonKey: 'anon-key',
  },
}));

vi.mock('../../../lib/server/supabaseAnon', () => ({
  createSupabaseAnon: () => ({
    auth: { signInWithPassword: signInMock },
  }),
}));

vi.mock('../../../lib/server/env', () => ({
  getSupabaseEnv: vi.fn(() => envMock),
}));

vi.mock('../../../lib/server/rateLimit', () => ({
  consumeRateLimit: consumeRateLimitMock,
}));

const postJson = (body: unknown, ip = '203.0.113.1') =>
  new Request('http://localhost/api/admin-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const credentials = () => ({
  email: 'ana@example.com',
  password: 'una-clave-larga',
});

const loadRoute = async () => {
  vi.resetModules();
  return await import('../admin-session');
};

describe('POST /api/admin-session', () => {
  beforeEach(() => {
    signInMock.mockReset();
    consumeRateLimitMock.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('anuncia Allow: POST en todos los métodos que no son POST', async () => {
    const { action, loader } = await loadRoute();

    const throughLoader = await loader();
    expect(throughLoader.status).toBe(405);
    expect(throughLoader.headers.get('Allow')).toBe('POST');

    const throughAction = await action({
      request: new Request('http://localhost/api/admin-session', { method: 'PUT' }),
    });
    expect(throughAction.status).toBe(405);
    expect(throughAction.headers.get('Allow')).toBe('POST');
  });

  it('rechaza un cuerpo que desborda el límite de la ruta', async () => {
    const { action } = await loadRoute();
    const response = await action({
      request: postJson(`{"email":"a@b.co","password":"${'x'.repeat(8192)}"}`),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid' });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('rechaza credenciales con forma inválida sin llamar a Supabase', async () => {
    const { action } = await loadRoute();
    const response = await action({
      request: postJson({ email: 'no-es-un-email', password: 'clave' }),
    });

    expect(response.status).toBe(400);
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('devuelve 429 con Retry-After cuando el límite por IP ya se agotó', async () => {
    consumeRateLimitMock.mockResolvedValue({ allowed: false, retryAfterSeconds: 42 });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(credentials()) });

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('42');
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('devuelve 429 cuando se agota el límite específico del correo', async () => {
    consumeRateLimitMock
      .mockResolvedValueOnce({ allowed: true, retryAfterSeconds: 0 })
      .mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 90 });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(credentials()) });

    expect(response.status).toBe(429);
    expect(consumeRateLimitMock).toHaveBeenCalledTimes(2);
    expect(consumeRateLimitMock.mock.calls[1]?.[0]).toContain('ana@example.com');
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('devuelve 401 sin distinguir si el fallo es de usuario o de contraseña', async () => {
    signInMock.mockResolvedValue({ data: { session: null, user: null }, error: { message: 'Invalid login credentials' } });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(credentials()) });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'invalid' });
  });

  it('deniega la sesión cuando el usuario que entra no es admin', async () => {
    signInMock.mockResolvedValue({
      data: {
        session: { access_token: 'jwt', refresh_token: 'refresh' },
        user: { app_metadata: { role: 'customer' } },
      },
      error: null,
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(credentials()) });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'notAdmin' });
  });

  it('entrega la sesión solo a un usuario admin y sin cachearla', async () => {
    signInMock.mockResolvedValue({
      data: {
        session: { access_token: 'jwt', refresh_token: 'refresh' },
        user: { app_metadata: { role: 'admin' } },
      },
      error: null,
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(credentials()) });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      access_token: 'jwt',
      refresh_token: 'refresh',
    });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('normaliza el correo antes de llamar a Supabase', async () => {
    signInMock.mockResolvedValue({
      data: {
        session: { access_token: 'jwt', refresh_token: 'refresh' },
        user: { app_metadata: { role: 'admin' } },
      },
      error: null,
    });
    const { action } = await loadRoute();
    await action({
      request: postJson({ email: '  Ana@Example.COM ', password: 'una-clave-larga' }),
    });

    expect(signInMock).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'una-clave-larga',
    });
  });

  it('avisa de indisponibilidad cuando faltan variables del servidor', async () => {
    const { getSupabaseEnv } = await import('../../../lib/server/env');
    vi.mocked(getSupabaseEnv).mockImplementationOnce(() => {
      throw new Error('Falta la variable de entorno SUPABASE_URL.');
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(credentials()) });

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'unavailable' });
  });
});
