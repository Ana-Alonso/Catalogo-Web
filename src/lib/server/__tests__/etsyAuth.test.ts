import { afterEach, describe, expect, it, vi } from 'vitest';
import { decryptToken, encryptToken } from '../tokenCipher';

const KEY = Buffer.alloc(32, 3).toString('base64');
const HOUR_MS = 60 * 60 * 1000;

const buildClient = (row: unknown) => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
  const selectEq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq: selectEq });
  const updateEq = vi.fn().mockResolvedValue({ error: null });
  const update = vi.fn().mockReturnValue({ eq: updateEq });
  const upsert = vi.fn().mockResolvedValue({ error: null });
  const from = vi.fn().mockReturnValue({ select, update, upsert });

  return { from, select, update, upsert };
};

const loadAuth = async (
  row: unknown,
  env: Record<string, unknown> = {}
) => {
  vi.resetModules();
  vi.doMock('../env', () => ({
    getServerEnv: () => ({
      etsyKeyString: 'keystring',
      etsySharedSecret: 'shared',
      etsyShopId: 'shop',
      etsyRefreshToken: null,
      etsyWebhookSecret: 'webhook',
      etsyTokenEncryptionKey: KEY,
      supabaseUrl: 'https://example.supabase.co',
      supabaseServiceRoleKey: 'service',
      supabaseAnonKey: 'anon',
      cronSecret: null,
      ...env,
    }),
  }));

  const client = buildClient(row);
  vi.doMock('../supabaseAdmin', () => ({
    createSupabaseAdmin: () => ({ from: client.from }),
  }));

  const module = await import('../etsyAuth');

  return { ...module, client };
};

const futureExpiry = (): string => new Date(Date.now() + HOUR_MS).toISOString();

describe('etsyAuth · credenciales cifradas', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.doUnmock('../env');
    vi.doUnmock('../supabaseAdmin');
  });

  it('devuelve el access token descifrado cuando sigue vigente', async () => {
    const { getEtsyAccessToken, client } = await loadAuth({
      access_token: encryptToken('access-plano', KEY),
      refresh_token: encryptToken('refresh-plano', KEY),
      access_token_expires_at: futureExpiry(),
    });

    await expect(getEtsyAccessToken()).resolves.toBe('access-plano');
    expect(client.update).not.toHaveBeenCalled();
    expect(client.upsert).not.toHaveBeenCalled();
  });

  it('cifra las credenciales heredadas en texto plano al leerlas', async () => {
    const { getEtsyAccessToken, client } = await loadAuth({
      access_token: 'access-claro',
      refresh_token: 'refresh-claro',
      access_token_expires_at: futureExpiry(),
    });

    await expect(getEtsyAccessToken()).resolves.toBe('access-claro');

    const payload = client.upsert.mock.calls[0]?.[0] as Record<string, string>;
    expect(payload.access_token).toMatch(/^enc:v1:/);
    expect(payload.refresh_token).toMatch(/^enc:v1:/);
    expect(decryptToken(payload.access_token, KEY)).toBe('access-claro');
    expect(decryptToken(payload.refresh_token, KEY)).toBe('refresh-claro');
  });

  it('guarda cifrados los tokens renovados', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'nuevo-access',
          refresh_token: 'nuevo-refresh',
          expires_in: 3600,
        }),
      })
    );

    const { getEtsyAccessToken, client } = await loadAuth({
      access_token: null,
      refresh_token: encryptToken('refresh-viejo', KEY),
      access_token_expires_at: new Date(Date.now() - HOUR_MS).toISOString(),
    });

    await expect(getEtsyAccessToken()).resolves.toBe('nuevo-access');

    const payload = client.upsert.mock.calls[0]?.[0] as Record<string, string>;
    expect(payload.access_token).toMatch(/^enc:v1:/);
    expect(payload.refresh_token).toMatch(/^enc:v1:/);
    expect(decryptToken(payload.access_token, KEY)).toBe('nuevo-access');
    expect(decryptToken(payload.refresh_token, KEY)).toBe('nuevo-refresh');
  });

  it('falla con un mensaje claro si la clave no puede descifrar los tokens', async () => {
    const { getEtsyAccessToken } = await loadAuth({
      access_token: encryptToken('access-plano', Buffer.alloc(32, 8).toString('base64')),
      refresh_token: encryptToken('refresh-plano', Buffer.alloc(32, 8).toString('base64')),
      access_token_expires_at: futureExpiry(),
    });

    await expect(getEtsyAccessToken()).rejects.toThrow();
  });

  it('usa el refresh token de entorno cuando no hay fila guardada', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'access-entorno',
          refresh_token: 'refresh-entorno',
          expires_in: 3600,
        }),
      })
    );

    const { getEtsyAccessToken, client } = await loadAuth(null, {
      etsyRefreshToken: 'refresh-de-env',
    });

    await expect(getEtsyAccessToken()).resolves.toBe('access-entorno');

    const payload = client.upsert.mock.calls[0]?.[0] as Record<string, string>;
    expect(decryptToken(payload.refresh_token, KEY)).toBe('refresh-entorno');
  });
});

describe('etsyAuth · marca de sincronización', () => {
  it('avisa cuando la base de datos rechaza la nueva marca de tiempo', async () => {
    const { markEtsySync, client } = await loadAuth({ id: 1 });
    client.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: { message: 'columna inexistente' } }),
    });
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(markEtsySync()).resolves.toBeUndefined();

    expect(report).toHaveBeenCalledWith('[etsy-auth]', 'columna inexistente');
    report.mockRestore();
  });

  it('no avisa cuando la marca se guarda correctamente', async () => {
    const { markEtsySync } = await loadAuth({ id: 1 });
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await markEtsySync();

    expect(report).not.toHaveBeenCalled();
    report.mockRestore();
  });
});
