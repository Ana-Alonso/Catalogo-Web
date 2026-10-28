import { formatPrice } from '../utils/price';
import { getIntlLocale } from './languages';

export const formatPriceForLanguage = (
  cents: number | null | undefined,
  currency: string | null | undefined,
  language: string
): string => formatPrice(cents, currency, getIntlLocale(language));

export const formatWorkshopDateForLanguage = (
  value: string,
  language: string
): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRegistrationDeadlineForLanguage = (
  value: string,
  language: string
): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), {
    day: 'numeric',
    month: 'short',
  }).format(date);
};
