import { describe, it, expect, afterEach } from 'vitest';
import es from '../locales/es.json';
import en from '../locales/en.json';
import { formatPriceForLanguage, formatWorkshopDateForLanguage } from '../formatters';
import { normalizeLanguage } from '../languages';
import { buildLocalizedPath, getPathLanguage } from '../paths';
import i18n, {
  LANGUAGE_COOKIE,
  LANGUAGE_STORAGE_KEY,
  persistLanguage,
} from '../index';

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

  it('mantiene las rutas de administración sin prefijo de idioma', () => {
    expect(buildLocalizedPath('/admin', '?tab=productos', '#formulario', 'en')).toBe(
      '/admin?tab=productos#formulario'
    );
    expect(buildLocalizedPath('/admin/productos', '', '', 'es')).toBe(
      '/admin/productos'
    );
  });

  it('traduce el panel de administración y sus interpolaciones', async () => {
    await i18n.changeLanguage('en');

    expect(i18n.t('admin.title')).toBe('Admin Panel');
    expect(i18n.t('admin.productTable.title', { count: 3 })).toBe(
      'Products in Catalog (3)'
    );
    expect(
      i18n.t('admin.etsySync.success', {
        total: 3,
        created: 1,
        updated: 1,
        hidden: 1,
      })
    ).toBe('Sync complete: 3 products (1 new, 1 updated, 1 hidden).');

    await i18n.changeLanguage('es');

    expect(i18n.t('admin.registrations.title', { count: 2 })).toBe(
      'Inscripciones a Talleres (2)'
    );
    expect(i18n.t('admin.productForm.imageFormatError')).toContain('PNG');
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
