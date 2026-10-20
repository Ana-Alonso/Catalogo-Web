import { getServerEnv } from './env';
import { getEtsyAccessToken } from './etsyAuth';

const API_BASE = 'https://api.etsy.com/v3/application';
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

export interface EtsyPrice {
  amount: number;
  divisor: number;
  currency_code: string;
}

export interface EtsyListingImage {
  listing_image_id?: number;
  rank?: number;
  url_fullxfull?: string;
  url_570xN?: string;
  url_75x75?: string;
}

export interface EtsyListing {
  listing_id: number;
  title?: string;
  description?: string;
  state?: string;
  quantity?: number;
  url?: string;
  price?: EtsyPrice;
  images?: EtsyListingImage[];
}

export class EtsyApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'EtsyApiError';
    this.status = status;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isEtsyListing = (value: unknown): value is EtsyListing =>
  isRecord(value) && typeof value.listing_id === 'number';

const toResults = (value: unknown): unknown[] => {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    throw new Error('Respuesta inesperada de Etsy.');
  }
  return value.results;
};

const requestJson = async (path: string, retry = true): Promise<unknown> => {
  const env = getServerEnv();
  const token = await getEtsyAccessToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'x-api-key': `${env.etsyKeyString}:${env.etsySharedSecret}`,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 && retry) {
    await getEtsyAccessToken(true);
    return requestJson(path, false);
  }

  const text = await response.text();

  if (!response.ok) {
    throw new EtsyApiError(
      response.status,
      `Etsy API ${response.status}: ${text.slice(0, 200)}`
    );
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error('Etsy devolvió una respuesta que no es JSON.');
  }
};

export const fetchActiveListings = async (
  shopId: string
): Promise<EtsyListing[]> => {
  const listings: EtsyListing[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_SIZE;
    const path = `/shops/${encodeURIComponent(shopId)}/listings?state=active&limit=${PAGE_SIZE}&offset=${offset}&includes=Images`;
    const batch = toResults(await requestJson(path)).filter(isEtsyListing);
    listings.push(...batch);

    if (batch.length < PAGE_SIZE) {
      return listings;
    }
  }

  throw new Error(
    'La tienda de Etsy tiene más listings activos de los que se pueden sincronizar de una vez.'
  );
};

export const fetchListing = async (listingId: number): Promise<EtsyListing> => {
  const payload = await requestJson(`/listings/${listingId}?includes=Images`);

  if (!isEtsyListing(payload)) {
    throw new Error('Etsy devolvió un producto con un formato inesperado.');
  }

  return payload;
};

export const fetchListingImages = async (
  listingId: number
): Promise<EtsyListingImage[]> => {
  const payload = await requestJson(`/listings/${listingId}/images`);
  return toResults(payload).filter(isRecord) as EtsyListingImage[];
};
