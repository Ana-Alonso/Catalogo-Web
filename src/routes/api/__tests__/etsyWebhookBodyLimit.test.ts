import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { syncSingleEtsyListingMock, hideEtsyListingMock, consumeRateLimitMock, webhookEnv } = vi.hoisted(() => ({
  syncSingleEtsyListingMock: vi.fn(),
  hideEtsyListingMock: vi.fn(),
  consumeRateLimitMock: vi.fn(),
  webhookEnv: {
    supabaseUrl: 'https://example.supabase.co',
    supabaseServiceRoleKey: 'service-role-key',
    supabaseAnonKey: 'anon-key',
    etsyKeyString: 'etsy-keystring',
    etsySharedSecret: 'etsy-shared-secret',
    etsyShopId: '987654321',
    etsyRefreshToken: null,
    etsyWebhookSecret: 'whsec_c2VjcmV0by1kZS1wcnVlYmE=',
    etsyTokenEncryptionKey: 'token-encryption-key',
    cronSecret: null,
  },
}));

vi.mock('../../../lib/server/etsySync', () => ({
  syncSingleEtsyListing: syncSingleEtsyListingMock,
  hideEtsyListing: hideEtsyListingMock,
}));

vi.mock('../../../lib/server/env', () => ({
  getServerEnv: () => webhookEnv,
}));

vi.mock('../../../lib/server/rateLimit', () => ({
  consumeRateLimit: consumeRateLimitMock,
}));

const secret = 'whsec_c2VjcmV0by1kZS1wcnVlYmE=';

const sign = (body: string, timestamp: number): string => {
  const digest = createHmac('sha256', Buffer.from(secret.replace('whsec_', ''), 'base64'))
    .update(`msg_123.${timestamp}.${body}`)
    .digest('base64');
  return `v1,${digest}`;
};

const postWebhook = (body: string) => {
  const timestamp = Math.floor(Date.now() / 1000);

  return new Request('http://localhost/api/etsy-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'webhook-id': 'msg_123',
      'webhook-timestamp': String(timestamp),
      'webhook-signature': sign(body, timestamp),
    },
    body,
  });
};

const loadRoute = async () => {
  vi.resetModules();
  return await import('../etsy-webhook');
};

describe('POST /api/etsy-webhook body limit', () => {
  beforeEach(() => {
    syncSingleEtsyListingMock.mockReset();
    hideEtsyListingMock.mockReset();
    syncSingleEtsyListingMock.mockResolvedValue(undefined);
    hideEtsyListingMock.mockResolvedValue(undefined);
    consumeRateLimitMock.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve 413 cuando el cuerpo supera el límite sin sincronizar', async () => {
    const body = JSON.stringify({
      event_type: 'listing.updated',
      listing_id: 123,
      padding: 'x'.repeat(70000),
    });
    const { action } = await loadRoute();
    const response = await action({ request: postWebhook(body) });

    expect(response.status).toBe(413);
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
    expect(hideEtsyListingMock).not.toHaveBeenCalled();
  });

  it('sigue procesando un webhook firmado válido dentro del límite', async () => {
    const body = JSON.stringify({ event_type: 'listing.updated', listing_id: 123, shop_id: 987654321 });
    const { action } = await loadRoute();
    const response = await action({ request: postWebhook(body) });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(syncSingleEtsyListingMock).toHaveBeenCalledWith(123);
  });

  it('oculta el listing en listing.deleted firmado y dentro del límite', async () => {
    const body = JSON.stringify({ event_type: 'listing.deleted', listing_id: 456, shop_id: 987654321 });
    const { action } = await loadRoute();
    const response = await action({ request: postWebhook(body) });

    expect(response.status).toBe(200);
    expect(hideEtsyListingMock).toHaveBeenCalledWith(456);
  });
});
