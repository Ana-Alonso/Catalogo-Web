import { describe, it, expect, afterEach } from 'vitest';
import es from '../locales/es.json';
import en from '../locales/en.json';
import { formatPriceForLanguage, formatWorkshopDateForLanguage } from '../formatters';
import { normalizeLanguage } from '../languages';
import { buildLocalizedPath, getPathLanguage } from '../paths';
import { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY, persistLanguage } from '../index';

const collectKeys = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nested]) =>
    collectKeys(nested, prefix ? `${prefix}.${key}` : key)
  );
};

describe('i18n', () => {
  afterEach(() => {
    persistLanguage('es');
  });

  it('normaliza idiomas desconocidos y regionales a es o en', () => {
    expect(normalizeLanguage('EN-us')).toBe('en');
    expect(normalizeLanguage('fr-FR')).toBe('es');
    expect(normalizeLanguage(undefined)).toBe('es');
  });

  it('conserva subrutas, query y hash al cambiar el prefijo de idioma', () => {
    expect(buildLocalizedPath('/en/galeria', '?page=2', '#obras', 'es')).toBe(
      '/es/galeria?page=2#obras'
    );
    expect(buildLocalizedPath('/es', '', '', 'en')).toBe('/en');
    expect(getPathLanguage('/en/talleres')).toBe('en');
  });

  it('formatea precios según el idioma activo', () => {
    const spanishPrice = formatPriceForLanguage(2550, 'EUR', 'es');
    const englishPrice = formatPriceForLanguage(2550, 'EUR', 'en');

    expect(spanishPrice).toContain('25,50');
    expect(englishPrice).toContain('25.50');
    expect(englishPrice).toContain('€');
  });

  it('mantiene la fecha original cuando no se puede interpretar', () => {
    expect(formatWorkshopDateForLanguage('fecha-invalida', 'en')).toBe(
      'fecha-invalida'
    );
  });

  it('mantiene la misma estructura de claves en es y en', () => {
    expect(collectKeys(en).sort()).toEqual(collectKeys(es).sort());
  });

  it('persiste el idioma en cookie, localStorage y documento', () => {
    persistLanguage('en');

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(document.cookie).toContain(`${LANGUAGE_COOKIE}=en`);
    expect(document.documentElement.lang).toBe('en');
  });
});
