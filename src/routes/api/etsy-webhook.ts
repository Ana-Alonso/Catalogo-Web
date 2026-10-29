import { getServerEnv, type ServerEnv } from '../../lib/server/env';
import {
  hideEtsyListing,
  syncSingleEtsyListing,
} from '../../lib/server/etsySync';
import { verifyEtsyWebhook } from '../../lib/server/verifyWebhook';

interface EtsyWebhookPayload {
  event_type?: string;
  listing_id?: number | string;
  shop_id?: number | string;
}

const MAX_WEBHOOK_BODY_LENGTH = 65536;

const LISTING_EVENTS = new Set([
  'listing.created',
  'listing.updated',
  'listing.deleted',
  'inventory.created',
  'inventory.updated',
  'inventory.deleted',
  'inventory.out_of_stock',
]);

const parsePayload = (rawBody: string): EtsyWebhookPayload | null => {
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    return parsed as EtsyWebhookPayload;
  } catch {
    return null;
  }
};

const toListingId = (value: number | string | undefined): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const jsonError = (status: number, message: string, headers?: HeadersInit): Response =>
  Response.json({ error: message }, { status, headers });

export const loader = () =>
  jsonError(405, 'Método no permitido.', { Allow: 'POST' });

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  if (request.method !== 'POST') {
    return jsonError(405, 'Método no permitido.', { Allow: 'POST' });
  }

  let env: ServerEnv;

  try {
    env = getServerEnv();
  } catch (err) {
    console.error(
      '[etsy-webhook]',
      err instanceof Error ? err.message : 'Configuración incompleta'
    );
    return jsonError(500, 'Configuración del servidor incompleta.');
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return jsonError(400, 'No se pudo leer el cuerpo de la petición.');
  }

  if (rawBody.length > MAX_WEBHOOK_BODY_LENGTH) {
    return jsonError(413, 'El cuerpo de la petición es demasiado grande.');
  }

  if (!verifyEtsyWebhook(request.headers, rawBody, env.etsyWebhookSecret)) {
    return jsonError(401, 'Firma de webhook inválida.');
  }

  const payload = parsePayload(rawBody);

  if (!payload) {
    return jsonError(400, 'Payload inválido.');
  }

  if (payload.shop_id == null) {
    return Response.json({ received: true, ignored: 'sin tienda' });
  }

  if (String(payload.shop_id) !== String(env.etsyShopId)) {
    return Response.json({ received: true, ignored: 'otra tienda' });
  }

  const eventType = payload.event_type?.toLowerCase();

  if (!eventType || !LISTING_EVENTS.has(eventType)) {
    return Response.json({ received: true, ignored: eventType ?? null });
  }

  const listingId = toListingId(payload.listing_id);

  if (!listingId) {
    return jsonError(400, 'Falta listing_id.');
  }

  try {
    switch (eventType) {
      case 'listing.deleted':
        await hideEtsyListing(listingId);
        break;
      default:
        await syncSingleEtsyListing(listingId);
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error(
      '[etsy-webhook]',
      err instanceof Error ? err.message : 'Error desconocido'
    );
    return jsonError(500, 'No se pudo procesar el webhook.');
  }
};
