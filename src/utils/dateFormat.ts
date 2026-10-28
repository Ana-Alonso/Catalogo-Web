import { getIntlLocale } from '../i18n/languages';

const format = (
  value: string | null | undefined,
  language: string,
  options: Intl.DateTimeFormatOptions
): string | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(getIntlLocale(language), options);
};

export const formatDateTime = (
  value: string | null | undefined,
  language: string
): string | null =>
  format(value, language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDate = (
  value: string | null | undefined,
  language: string
): string | null =>
  format(value, language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
