import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock('../supabaseAdmin', () => ({
  createSupabaseAdmin: () => ({ rpc: rpcMock }),
}));

import { consumeRateLimit } from '../rateLimit';

describe('consumeRateLimit', () => {
  beforeEach(() => {
    rpcMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('permite cuando la RPC lo autoriza y reenvía la clave y el límite', async () => {
    rpcMock.mockResolvedValue({
      data: [{ allowed: true, retry_after_seconds: 0 }],
      error: null,
    });

    await expect(consumeRateLimit('ip-1', 3, 60_000)).resolves.toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });

    expect(rpcMock).toHaveBeenCalledWith('consume_rate_limit', {
      p_bucket_key: 'ip-1',
      p_limit: 3,
      p_window_ms: 60_000,
    });
  });

  it('rechaza y reenvía los segundos de reintento cuando la RPC lo deniega', async () => {
    rpcMock.mockResolvedValue({
      data: [{ allowed: false, retry_after_seconds: 42 }],
      error: null,
    });

    await expect(consumeRateLimit('ip-2', 3, 60_000)).resolves.toEqual({
      allowed: false,
      retryAfterSeconds: 42,
    });
  });

  it('repliega a memoria y avisa por consola cuando la RPC falla', async () => {
    rpcMock.mockRejectedValue(new Error('conexión interrumpida'));

    await expect(consumeRateLimit('ip-3', 1, 60_000)).resolves.toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });
    await expect(consumeRateLimit('ip-3', 1, 60_000)).resolves.toEqual({
      allowed: false,
      retryAfterSeconds: 60,
    });

    expect(console.error).toHaveBeenCalledWith('[rate-limit]', 'conexión interrumpida');
  });

  it('repliega a memoria cuando la RPC no devuelve ninguna fila', async () => {
    rpcMock.mockResolvedValue({ data: [], error: null });

    await expect(consumeRateLimit('ip-4', 1, 30_000)).resolves.toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });

    expect(console.error).toHaveBeenCalledWith('[rate-limit]', expect.any(String));
  });
});
