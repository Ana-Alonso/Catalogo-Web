import { LANGUAGE_COOKIE } from './constants';
import { isSupportedLanguage, type SupportedLanguage } from './languages';
import { getPathLanguage } from './paths';

const readCookie = (header: string | null, name: string): string | null => {
  if (!header) {
    return null;
  }

  const entry = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!entry) {
    return null;
  }

  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return null;
  }
};

const resolveAcceptLanguage = (header: string | null): SupportedLanguage => {
  if (!header) {
    return 'es';
  }

  const preferences = header
    .split(',')
    .map((part) => {
      const [rawTag, ...parameters] = part.trim().split(';');
      const qualityParameter = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => /^q\s*=/i.test(parameter));
      const numericQuality = qualityParameter
        ? Number(qualityParameter.replace(/^q\s*=\s*/i, ''))
        : 1;

      return {
        tag: rawTag.trim().toLowerCase(),
        quality: Number.isFinite(numericQuality) ? numericQuality : 0,
      };
    })
    .filter((preference) => preference.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  const preferred = preferences.find(
    (preference) =>
      preference.tag === 'en' ||
      preference.tag.startsWith('en-') ||
      preference.tag === 'es' ||
      preference.tag.startsWith('es-')
  );

  return preferred?.tag.startsWith('en') ? 'en' : 'es';
};

export const resolvePreferredLanguage = (
  request: Request
): SupportedLanguage => {
  const pathLanguage = getPathLanguage(new URL(request.url).pathname);

  if (pathLanguage) {
    return pathLanguage;
  }

  const cookieLanguage = readCookie(
    request.headers.get('cookie'),
    LANGUAGE_COOKIE
  );

  if (cookieLanguage && isSupportedLanguage(cookieLanguage)) {
    return cookieLanguage;
  }

  return resolveAcceptLanguage(request.headers.get('accept-language'));
};

export default resolvePreferredLanguage;
