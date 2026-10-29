import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { syncEtsyListingsMock, getUserMock, consumeRateLimitMock } = vi.hoisted(() => ({
  syncEtsyListingsMock: vi.fn(),
  getUserMock: vi.fn(),
  consumeRateLimitMock: vi.fn(),
}));

vi.mock('../../../lib/server/etsySync', () => ({
  syncEtsyListings: syncEtsyListingsMock,
}));

vi.mock('../../../lib/server/rateLimit', () => ({
  consumeRateLimit: consumeRateLimitMock,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth: { getUser: getUserMock } }),
}));

const CRON_SECRET = 'cron-secret-de-prueba';

const syncResult = { created: 2, updated: 1, hidden: 0, total: 3 };

const requiredEnv: Record<string, string> = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  SUPABASE_ANON_KEY: 'anon-key',
  ETSY_KEYSTRING: 'keystring',
  ETSY_SHARED_SECRET: 'shared-secret',
  ETSY_SHOP_ID: '7777',
  ETSY_WEBHOOK_SECRET: 'webhook-secret',
  ETSY_TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 3).toString('base64'),
  CRON_SECRET,
};

const originalEnv = { ...process.env };

const loadRoute = async () => {
  vi.resetModules();
  return await import('../etsy-sync');
};

const buildRequest = (
  method: string,
  token?: string
): Request =>
  new Request('http://localhost/api/etsy-sync', {
    method,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });

const adminUser = { app_metadata: { role: 'admin' } };
const regularUser = { app_metadata: { role: 'customer' } };

describe('GET /api/etsy-sync · sincronización programada con secreto de cron', () => {
  beforeEach(() => {
    Object.assign(process.env, requiredEnv);
    syncEtsyListingsMock.mockReset();
    getUserMock.mockReset();
    consumeRateLimitMock.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it('ejecuta la sincronización cuando el bearer coincide con el secreto', async () => {
    syncEtsyListingsMock.mockResolvedValue(syncResult);
    const { loader } = await loadRoute();
    const response = await loader({ request: buildRequest('GET', CRON_SECRET) });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(syncResult);
    expect(syncEtsyListingsMock).toHaveBeenCalledTimes(1);
  });

  it('acepta el prefijo bearer sin importar su capitalización', async () => {
    syncEtsyListingsMock.mockResolvedValue(syncResult);
    const { loader } = await loadRoute();
    const request = new Request('http://localhost/api/etsy-sync', {
      headers: { authorization: `bearer ${CRON_SECRET}` },
    });
    const response = await loader({ request });

    expect(response.status).toBe(200);
  });

  it.each([
    ['sin cabecera de autorización', undefined],
    ['un token equivocado de la misma longitud', 'cron-secret-incorrecto!'],
    ['un token equivocado de otra longitud', 'token-corto'],
  ])('rechaza %s con 401 sin sincronizar', async (_label, token) => {
    const { loader } = await loadRoute();
    const response = await loader({ request: buildRequest('GET', token) });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'No autorizado.' });
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
  });

  it('rechaza cualquier token cuando el secreto de cron no está configurado', async () => {
    process.env.CRON_SECRET = '';
    const { loader } = await loadRoute();
    const response = await loader({ request: buildRequest('GET', 'cualquier-token') });

    expect(response.status).toBe(401);
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
  });

  it('devuelve 500 cuando falta configuración del servidor', async () => {
    delete process.env.ETSY_SHOP_ID;
    const { loader } = await loadRoute();
    const response = await loader({ request: buildRequest('GET', CRON_SECRET) });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Configuración del servidor incompleta.',
    });
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
  });

  it('responde con un error genérico y no filtra el fallo interno', async () => {
    syncEtsyListingsMock.mockRejectedValue(new Error('fallo interno con datos privados'));
    const { loader } = await loadRoute();
    const response = await loader({ request: buildRequest('GET', CRON_SECRET) });

    expect(response.status).toBe(500);
    const body = await response.text();
    expect(body).toBe('{"error":"No se pudo sincronizar con Etsy."}');
    expect(body).not.toContain('datos privados');
  });

  it('devuelve 429 cuando el limitador rechaza la llamada programada', async () => {
    consumeRateLimitMock.mockResolvedValue({ allowed: false, retryAfterSeconds: 30 });
    const { loader } = await loadRoute();
    const response = await loader({ request: buildRequest('GET', CRON_SECRET) });

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('30');
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
    expect(consumeRateLimitMock).toHaveBeenCalledWith(
      expect.stringContaining('etsy-sync-cron:'),
      20,
      15 * 60 * 1000
    );
  });
});

describe('POST /api/etsy-sync · sincronización manual de administrador', () => {
  beforeEach(() => {
    Object.assign(process.env, requiredEnv);
    syncEtsyListingsMock.mockReset();
    getUserMock.mockReset();
    consumeRateLimitMock.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it('rechaza los métodos que no son POST con 405 y la cabecera Allow', async () => {
    const { action } = await loadRoute();
    const response = await action({ request: buildRequest('GET', CRON_SECRET) });

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('GET, POST');
    expect(await response.json()).toEqual({ error: 'Método no permitido.' });
  });

  it('sincroniza cuando Supabase confirma un usuario administrador', async () => {
    getUserMock.mockResolvedValue({ data: { user: adminUser }, error: null });
    syncEtsyListingsMock.mockResolvedValue(syncResult);
    const { action } = await loadRoute();
    const response = await action({ request: buildRequest('POST', 'token-de-admin') });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(syncResult);
    expect(getUserMock).toHaveBeenCalledWith('token-de-admin');
  });

  it.each([
    ['un usuario que no es administrador', { data: { user: regularUser }, error: null }],
    ['un usuario inexistente', { data: { user: null }, error: null }],
    ['un token rechazado por Supabase', { data: { user: null }, error: new Error('invalid jwt') }],
  ])('rechaza con 401 %s', async (_label, getUserResult) => {
    getUserMock.mockResolvedValue(getUserResult);
    const { action } = await loadRoute();
    const response = await action({ request: buildRequest('POST', 'token-investiga') });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'No autorizado.' });
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
  });

  it.each([
    ['un POST sin cabecera de autorización', undefined],
    ['un POST con el secreto de cron como bearer de usuario', CRON_SECRET],
  ])('rechaza con 401 %s', async (_label, token) => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: new Error('invalid jwt') });
    const { action } = await loadRoute();
    const response = await action({ request: buildRequest('POST', token) });

    expect(response.status).toBe(401);
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
  });

  it('devuelve 500 cuando falta configuración del servidor', async () => {
    delete process.env.SUPABASE_URL;
    const { action } = await loadRoute();
    const response = await action({ request: buildRequest('POST', 'token-de-admin') });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Configuración del servidor incompleta.',
    });
  });

  it('devuelve 429 cuando el limitador rechaza la sincronización manual', async () => {
    consumeRateLimitMock.mockResolvedValue({ allowed: false, retryAfterSeconds: 15 });
    const { action } = await loadRoute();
    const response = await action({ request: buildRequest('POST', 'token-de-admin') });

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('15');
    expect(getUserMock).not.toHaveBeenCalled();
    expect(syncEtsyListingsMock).not.toHaveBeenCalled();
    expect(consumeRateLimitMock).toHaveBeenCalledWith(
      expect.stringContaining('etsy-sync-admin:'),
      10,
      5 * 60 * 1000
    );
  });
});
