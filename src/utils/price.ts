import type { CatalogItem } from '../types/catalog';

const DEFAULT_CURRENCY = 'EUR';
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export const parsePriceToCents = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/[^\d,.]/g, '');

  if (!normalized) {
    return null;
  }

  let numeric = normalized;

  if (normalized.includes(',')) {
    numeric = normalized.replace(/\./g, '').replace(',', '.');
  } else {
    const parts = normalized.split('.');
    if (parts.length > 2) {
      numeric = `${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`;
    }
  }

  const parsed = Number(numeric);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
};

const normalizeCurrency = (currency?: string | null): string => {
  const candidate = (currency ?? DEFAULT_CURRENCY).trim().toUpperCase();
  return CURRENCY_PATTERN.test(candidate) ? candidate : DEFAULT_CURRENCY;
};

export const formatPrice = (
  cents?: number | null,
  currency?: string | null,
  locale = 'es-ES'
): string => {
  if (cents == null) {
    return '';
  }

  const code = normalizeCurrency(currency);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
};

export const getDiscountedCents = (
  cents?: number | null,
  discountPercent?: number | null
): number | null => {
  if (cents == null) {
    return null;
  }

  if (discountPercent == null || discountPercent < 1 || discountPercent > 90) {
    return cents;
  }

  return Math.round((cents * (100 - discountPercent)) / 100);
};

const isPercentInRange = (percent?: number | null): percent is number =>
  percent != null && percent >= 1 && percent <= 90;

type OfferFields = Pick<
  CatalogItem,
  'source' | 'priceCents' | 'discountPercent' | 'etsyOnSale'
>;

export const isEtsyOffer = (item: OfferFields): boolean =>
  item.source === 'etsy' && item.etsyOnSale === true;

export const getOfferPercent = (item: OfferFields): number | null => {
  if (item.source === 'etsy' || item.priceCents == null) {
    return null;
  }

  return isPercentInRange(item.discountPercent) ? item.discountPercent : null;
};

export const isOfferActive = (item: OfferFields): boolean =>
  isEtsyOffer(item) || getOfferPercent(item) != null;
