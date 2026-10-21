import { isSupportedLanguage, type SupportedLanguage } from './languages';

export const getPathLanguage = (pathname: string): SupportedLanguage | null => {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isSupportedLanguage(segment) ? segment : null;
};

export const buildLocalizedPath = (
  pathname: string,
  search: string,
  hash: string,
  language: SupportedLanguage
): string => {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return `${pathname}${search}${hash}`;
  }

  const segments = pathname.split('/').filter(Boolean);

  if (isSupportedLanguage(segments[0])) {
    segments.shift();
  }

  const path = segments.length > 0 ? `/${segments.join('/')}` : '';

  return `/${language}${path}${search}${hash}`;
};
