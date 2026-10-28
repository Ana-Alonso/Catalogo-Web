import type { EtsyListing, EtsyListingImage } from './etsyClient';
import { truncateTitle } from './etsyTitle';

type EtsyProductStatus = 'disponible' | 'reservado' | 'vendido';

export interface EtsyProductFields {
  title: string;
  description: string;
  image: string;
  etsyLink: string;
  priceCents: number | null;
  currency: string;
  status: EtsyProductStatus;
  source: 'etsy';
  etsyListingId: number;
  etsyState: string;
  etsySyncedAt: string;
  isVisible: boolean;
}

const TITLE_LIMIT = 120;
const DESCRIPTION_LIMIT = 2000;

const decodeEntities = (value: string): string =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");

const stripHtml = (value: string): string =>
  decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

const toPriceCents = (listing: EtsyListing): number | null => {
  const price = listing.price;
  if (!price || !Number.isFinite(price.amount) || price.amount < 0) {
    return null;
  }
  if (!Number.isFinite(price.divisor) || price.divisor <= 0) {
    return null;
  }
  return Math.round((price.amount / price.divisor) * 100);
};

const toCurrency = (listing: EtsyListing): string => {
  const code = listing.price?.currency_code?.toUpperCase() ?? '';
  return /^[A-Z]{3}$/.test(code) ? code : 'EUR';
};

export const pickListingImage = (images?: EtsyListingImage[]): string => {
  if (!images || images.length === 0) {
    return '';
  }
  const sorted = [...images].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  for (const image of sorted) {
    const url = image.url_fullxfull || image.url_570xN || image.url_75x75;
    if (url) {
      return url;
    }
  }
  return '';
};

export const mapEtsyListing = (listing: EtsyListing): EtsyProductFields => {
  const cleanTitle = truncateTitle(stripHtml(listing.title ?? ''), TITLE_LIMIT);
  const cleanDescription = stripHtml(listing.description ?? '').slice(
    0,
    DESCRIPTION_LIMIT
  );
  const state = listing.state ?? 'inactive';
  const quantity = listing.quantity ?? 0;

  return {
    title: cleanTitle || `Producto de Etsy #${listing.listing_id}`,
    description: cleanDescription,
    image: pickListingImage(listing.images),
    etsyLink: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`,
    priceCents: toPriceCents(listing),
    currency: toCurrency(listing),
    status: state === 'active' && quantity > 0 ? 'disponible' : 'vendido',
    source: 'etsy',
    etsyListingId: listing.listing_id,
    etsyState: state,
    etsySyncedAt: new Date().toISOString(),
    isVisible: state === 'active',
  };
};
