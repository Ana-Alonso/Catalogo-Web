import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MetaDescriptor } from 'react-router';
import {
  getAdminMeta,
  getDefaultMeta,
  getHomeMeta,
  getNotFoundMeta,
  getRootLanguage,
} from '../meta';

const readMeta = (item: MetaDescriptor): Record<string, unknown> =>
  item as Record<string, unknown>;

const findMeta = (
  meta: MetaDescriptor[],
  key: 'name' | 'property',
  value: string
): Record<string, unknown> | undefined =>
  meta.map(readMeta).find((item) => item[key] === value);

const findLink = (
  meta: MetaDescriptor[],
  rel: string,
  hrefLang?: string
): Record<string, unknown> | undefined =>
  meta
    .map(readMeta)
    .find(
      (item) =>
        item.tagName === 'link' &&
        item.rel === rel &&
        (hrefLang === undefined || item.hrefLang === hrefLang)
    );

const content = (
  item: Record<string, unknown> | undefined
): string | undefined =>
  typeof item?.content === 'string' ? item.content : undefined;

const getTitle = (meta: MetaDescriptor[]): string | undefined => {
  const item = meta
    .map(readMeta)
    .find((entry) => typeof entry.title === 'string');

  return typeof item?.title === 'string' ? item.title : undefined;
};

const hasJsonLd = (meta: MetaDescriptor[]): boolean =>
  meta.some((item) => 'script:ld+json' in readMeta(item));

type MetaMatches = Parameters<typeof getRootLanguage>[0];

const createMatches = (data: unknown): MetaMatches =>
  [{ id: 'root', data }] as unknown as MetaMatches;

describe('getHomeMeta', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL_ENV', 'production');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('genera metadatos españoles con canonical y alternates', () => {
    const meta = getHomeMeta('es', 'https://example.com');

    expect(getTitle(meta)).toContain('Laurel en Lienzo');
    expect(content(findMeta(meta, 'name', 'description'))).toContain('Catálogo');
    expect(content(findMeta(meta, 'name', 'robots'))).toBe('index, follow');
    expect(findLink(meta, 'canonical')?.href).toBe('https://example.com/es');
    expect(findLink(meta, 'alternate', 'es')?.href).toBe(
      'https://example.com/es'
    );
    expect(findLink(meta, 'alternate', 'en')?.href).toBe(
      'https://example.com/en'
    );
    expect(findLink(meta, 'alternate', 'x-default')?.href).toBe(
      'https://example.com/es'
    );
    expect(content(findMeta(meta, 'property', 'og:locale'))).toBe('es_ES');
    expect(content(findMeta(meta, 'property', 'og:locale:alternate'))).toBe(
      'en_GB'
    );
    expect(content(findMeta(meta, 'property', 'og:url'))).toBe(
      'https://example.com/es'
    );
    expect(hasJsonLd(meta)).toBe(false);
  });

  it('genera metadatos ingleses con imagen social absoluta', () => {
    const meta = getHomeMeta('en', 'https://example.com');

    expect(getTitle(meta)).toContain('Custom illustrations');
    expect(findLink(meta, 'canonical')?.href).toBe('https://example.com/en');
    expect(content(findMeta(meta, 'property', 'og:image'))).toBe(
      'https://example.com/og-image.png'
    );
    expect(content(findMeta(meta, 'property', 'og:locale'))).toBe('en_GB');
    expect(content(findMeta(meta, 'property', 'og:locale:alternate'))).toBe(
      'es_ES'
    );
  });

  it('marca noindex en despliegues de preview', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');

    const meta = getHomeMeta('es', 'https://example.com');

    expect(content(findMeta(meta, 'name', 'robots'))).toBe('noindex, nofollow');
  });

  it('incluye twitter card y texto alternativo de imagen', () => {
    const meta = getHomeMeta('es', 'https://example.com');

    expect(content(findMeta(meta, 'name', 'twitter:card'))).toBe(
      'summary_large_image'
    );
    expect(content(findMeta(meta, 'name', 'twitter:image:alt'))).toBe(
      getTitle(meta)
    );
    expect(content(findMeta(meta, 'property', 'og:image:alt'))).toBe(
      getTitle(meta)
    );
  });
});

describe('getNotFoundMeta', () => {
  it('marca la página 404 como noindex', () => {
    const meta = getNotFoundMeta('en');

    expect(getTitle(meta)).toContain('Page not found');
    expect(content(findMeta(meta, 'name', 'robots'))).toBe('noindex, nofollow');
    expect(content(findMeta(meta, 'name', 'description'))).toBeTruthy();
  });

  it('usa el idioma recibido para el título', () => {
    expect(getTitle(getNotFoundMeta('es'))).toContain('Página no encontrada');
    expect(getTitle(getNotFoundMeta('en'))).toContain('Page not found');
  });
});

describe('getAdminMeta', () => {
  it('marca el panel de administración como noindex', () => {
    const meta = getAdminMeta('es');

    expect(getTitle(meta)).toContain('Panel de Administración');
    expect(content(findMeta(meta, 'name', 'robots'))).toBe('noindex, nofollow');
  });
});

describe('getDefaultMeta', () => {
  it('usa los metadatos españoles como fallback', () => {
    const meta = getDefaultMeta();

    expect(getTitle(meta)).toContain('Laurel en Lienzo');
    expect(content(findMeta(meta, 'name', 'description'))).toBeTruthy();
    expect(findMeta(meta, 'name', 'robots')).toBeUndefined();
  });
});

describe('getRootLanguage', () => {
  it('lee el idioma preferido del loader raíz', () => {
    expect(getRootLanguage(createMatches({ preferredLanguage: 'en' }))).toBe(
      'en'
    );
  });

  it('normaliza idiomas no soportados a español', () => {
    expect(getRootLanguage(createMatches({ preferredLanguage: 'fr' }))).toBe(
      'es'
    );
  });

  it('cae en español cuando no hay datos del loader raíz', () => {
    expect(getRootLanguage(createMatches(undefined))).toBe('es');
  });
});
