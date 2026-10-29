import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { hideEtsyListingMock, syncSingleEtsyListingMock } = vi.hoisted(() => ({
  hideEtsyListingMock: vi.fn(),
  syncSingleEtsyListingMock: vi.fn(),
}));

vi.mock('../../../lib/server/etsySync', () => ({
  hideEtsyListing: hideEtsyListingMock,
  syncSingleEtsyListing: syncSingleEtsyListingMock,
}));

const WEBHOOK_SECRET = `whsec_${Buffer.alloc(16, 7).toString('base64')}`;
const SHOP_ID = '7777';

const requiredEnv: Record<string, string> = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  SUPABASE_ANON_KEY: 'anon-key',
  ETSY_KEYSTRING: 'keystring',
  ETSY_SHARED_SECRET: 'shared-secret',
  ETSY_SHOP_ID: SHOP_ID,
  ETSY_WEBHOOK_SECRET: WEBHOOK_SECRET,
  ETSY_TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 3).toString('base64'),
  CRON_SECRET: 'cron-secret-de-prueba',
};

const originalEnv = { ...process.env };

const loadRoute = async () => {
  vi.resetModules();
  return await import('../etsy-webhook');
};

const signBody = (body: string, id: string, timestamp: number): string =>
  `v1,${createHmac('sha256', Buffer.from(WEBHOOK_SECRET.slice(WEBHOOK_SECRET.indexOf('_') + 1), 'base64'))
    .update(`${id}.${timestamp}.${body}`)
    .digest('base64')}`;

const buildWebhookRequest = (
  body: string,
  overrides: { signature?: string; timestamp?: number } = {}
): Request => {
  const id = 'msg_123';
  const timestamp = overrides.timestamp ?? Math.floor(Date.now() / 1000);
  return new Request('http://localhost/api/etsy-webhook', {
    method: 'POST',
    body,
    headers: {
      'webhook-id': id,
      'webhook-timestamp': String(timestamp),
      'webhook-signature': overrides.signature ?? signBody(body, id, timestamp),
    },
  });
};

const postEvent = (payload: Record<string, unknown> = {}): Promise<Response> => {
  const body = JSON.stringify({ shop_id: SHOP_ID, ...payload });
  return loadRoute().then(({ action }) =>
    action({ request: buildWebhookRequest(body) })
  );
};

describe('POST /api/etsy-webhook', () => {
  beforeEach(() => {
    Object.assign(process.env, requiredEnv);
    hideEtsyListingMock.mockReset().mockResolvedValue(undefined);
    syncSingleEtsyListingMock.mockReset().mockResolvedValue(undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it('anuncia Allow: POST también cuando el método llega al action', async () => {
    const { action } = await loadRoute();
    const response = await action({
      request: new Request('http://localhost/api/etsy-webhook', { method: 'PUT' }),
    });

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('no permite sincronizar con GET y anuncia Allow: POST', async () => {
    const { loader } = await loadRoute();
    const response = loader();

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it.each([
    ['listing.created', syncSingleEtsyListingMock],
    ['listing.updated', syncSingleEtsyListingMock],
    ['inventory.created', syncSingleEtsyListingMock],
    ['inventory.updated', syncSingleEtsyListingMock],
    ['inventory.deleted', syncSingleEtsyListingMock],
    ['inventory.out_of_stock', syncSingleEtsyListingMock],
    ['listing.deleted', hideEtsyListingMock],
  ])('procesan el evento %s en la librería de sincronización', async (eventType, handlerMock) => {
    const response = await postEvent({ event_type: eventType, listing_id: 42 });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(handlerMock).toHaveBeenCalledWith(42);
  });

  it('normaliza el nombre del evento a minúsculas', async () => {
    const response = await postEvent({ event_type: 'LISTING.UPDATED', listing_id: 42 });

    expect(response.status).toBe(200);
    expect(syncSingleEtsyListingMock).toHaveBeenCalledWith(42);
  });

  it('acepta un listing_id enviado como texto', async () => {
    const response = await postEvent({ event_type: 'listing.updated', listing_id: '42' });

    expect(response.status).toBe(200);
    expect(syncSingleEtsyListingMock).toHaveBeenCalledWith(42);
  });

  it('ignora con 200 un webhook firmado de otra tienda', async () => {
    const response = await postEvent({
      event_type: 'listing.updated',
      listing_id: 42,
      shop_id: 8888,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, ignored: 'otra tienda' });
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
  });

  it('ignora un webhook firmado que no identifica a ninguna tienda', async () => {
    const response = await postEvent({
      event_type: 'listing.updated',
      listing_id: 42,
      shop_id: undefined,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, ignored: 'sin tienda' });
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
    expect(hideEtsyListingMock).not.toHaveBeenCalled();
  });

  it('ignora los eventos que no afectan a publicaciones', async () => {
    const response = await postEvent({ event_type: 'shop.updated', listing_id: 42 });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, ignored: 'shop.updated' });
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
  });

  it('ignora un payload sin event_type', async () => {
    const response = await postEvent({ listing_id: 42 });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, ignored: null });
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
  });

  it('rechaza con 401 una firma inválida antes de leer el payload', async () => {
    const body = JSON.stringify({ event_type: 'listing.updated', listing_id: 42 });
    const { action } = await loadRoute();
    const response = await action({
      request: buildWebhookRequest(body, { signature: 'v1,ZmlybWEtmWFsbGE=' }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Firma de webhook inválida.' });
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
  });

  it('rechaza con 401 un body alterado respecto a la firma', async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const original = JSON.stringify({ event_type: 'listing.updated', listing_id: 42 });
    const signature = signBody(original, 'msg_123', timestamp);
    const tampered = JSON.stringify({ event_type: 'listing.deleted', listing_id: 42 });
    const { action } = await loadRoute();
    const response = await action({
      request: buildWebhookRequest(tampered, { signature, timestamp }),
    });

    expect(response.status).toBe(401);
    expect(hideEtsyListingMock).not.toHaveBeenCalled();
  });

  it.each([
    ['que no es JSON', 'esto-no-es-json'],
    ['un JSON que no es un objeto', '"una-cadena"'],
  ])('rechaza con 400 un payload firmado %s', async (_label, rawBody) => {
    const { action } = await loadRoute();
    const response = await action({ request: buildWebhookRequest(rawBody) });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Payload inválido.' });
  });

  it.each([
    ['ausente', undefined],
    ['cero', 0],
    ['negativo', -1],
    ['no entero', 1.5],
    ['no numérico', 'abc'],
  ])('rechaza con 400 un evento de listado con listing_id %s', async (_label, listingId) => {
    const payload: Record<string, unknown> = { event_type: 'listing.updated' };
    if (listingId !== undefined) {
      payload.listing_id = listingId;
    }
    const response = await postEvent(payload);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Falta listing_id.' });
    expect(syncSingleEtsyListingMock).not.toHaveBeenCalled();
  });

  it('devuelve 500 genérico cuando la sincronización del listado falla', async () => {
    syncSingleEtsyListingMock.mockRejectedValue(new Error('detalle interno del fallo'));
    const response = await postEvent({ event_type: 'listing.updated', listing_id: 42 });

    expect(response.status).toBe(500);
    const body = await response.text();
    expect(body).toBe('{"error":"No se pudo procesar el webhook."}');
    expect(body).not.toContain('detalle interno');
  });

  it('devuelve 500 cuando falta configuración del servidor', async () => {
    delete process.env.ETSY_WEBHOOK_SECRET;
    const response = await postEvent({ event_type: 'listing.updated', listing_id: 42 });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Configuración del servidor incompleta.',
    });
  });
});
