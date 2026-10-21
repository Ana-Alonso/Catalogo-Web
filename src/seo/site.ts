export const DEFAULT_SITE_URL = 'https://laurelenlienzo.vercel.app';
export const SITE_NAME = 'Laurel en Lienzo';
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';

export const getSiteUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL;
};

export const getAbsoluteUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
};
