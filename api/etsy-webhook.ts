import { getServerEnv, type ServerEnv } from './_lib/env';
import type { ApiRequest, ApiResponse } from './_lib/http';
import { readRawBody } from './_lib/http';
import { verifyEtsyWebhook } from './_lib/verifyWebhook';
import {
  hideEtsyListing,
  syncSingleEtsyListing,
} from './_lib/etsySync';

export const config = { api: { bodyParser: false } };

interface EtsyWebhookPayload {
  event_type?: string;
  listing_id?: number | string;
  shop_id?: number | string;
}

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

export default async function handler(
  req: ApiRequest,
  res: ApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  let env: ServerEnv;

  try {
    env = getServerEnv();
  } catch (error) {
    console.error(
      '[etsy-webhook]',
      error instanceof Error ? error.message : 'Configuración incompleta'
    );
    res.status(500).json({ error: 'Configuración del servidor incompleta.' });
    return;
  }

  let rawBody: string;

  try {
    rawBody = await readRawBody(req);
  } catch {
    res.status(400).json({ error: 'No se pudo leer el cuerpo de la petición.' });
    return;
  }

  if (!verifyEtsyWebhook(req, rawBody, env.etsyWebhookSecret)) {
    res.status(401).json({ error: 'Firma de webhook inválida.' });
    return;
  }

  const payload = parsePayload(rawBody);

  if (!payload) {
    res.status(400).json({ error: 'Payload inválido.' });
    return;
  }

  if (
    payload.shop_id != null &&
    String(payload.shop_id) !== String(env.etsyShopId)
  ) {
    res.status(200).json({ received: true, ignored: 'otra tienda' });
    return;
  }

  const eventType = payload.event_type?.toLowerCase();

  if (!eventType || !LISTING_EVENTS.has(eventType)) {
    res.status(200).json({ received: true, ignored: eventType ?? null });
    return;
  }

  const listingId = toListingId(payload.listing_id);

  if (!listingId) {
    res.status(400).json({ error: 'Falta listing_id.' });
    return;
  }

  try {
    switch (eventType) {
      case 'listing.deleted':
        await hideEtsyListing(listingId);
        break;
      default:
        await syncSingleEtsyListing(listingId);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(
      '[etsy-webhook]',
      error instanceof Error ? error.message : 'Error desconocido'
    );
    res.status(500).json({ error: 'No se pudo procesar el webhook.' });
  }
}
