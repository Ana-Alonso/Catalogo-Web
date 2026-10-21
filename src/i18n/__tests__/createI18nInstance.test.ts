import { describe, expect, it } from 'vitest';
import { createI18nInstance } from '../createI18nInstance';

describe('createI18nInstance', () => {
  it('crea una instancia inicializada en español', () => {
    const instance = createI18nInstance('es');

    expect(instance.isInitialized).toBe(true);
    expect(instance.language).toBe('es');
    expect(instance.t('meta.title')).toContain('Laurel en Lienzo');
  });

  it('crea una instancia en inglés con sus traducciones', () => {
    const instance = createI18nInstance('en');

    expect(instance.language).toBe('en');
    expect(instance.t('admin.title')).toBe('Admin Panel');
  });

  it('mantiene aisladas las instancias de cada idioma', () => {
    const spanish = createI18nInstance('es');
    const english = createI18nInstance('en');
    const secondSpanish = createI18nInstance('es');

    expect(spanish.t('admin.title')).toBe('Panel de Administración');
    expect(english.t('admin.title')).toBe('Admin Panel');
    expect(secondSpanish.t('admin.title')).toBe('Panel de Administración');
  });

  it('no comparte cambios de idioma entre instancias', async () => {
    const first = createI18nInstance('es');
    const second = createI18nInstance('es');

    await first.changeLanguage('en');

    expect(first.language).toBe('en');
    expect(second.language).toBe('es');
    expect(second.t('admin.title')).toBe('Panel de Administración');
  });

  it('usa español como fallback de idioma', () => {
    const instance = createI18nInstance('es');

    expect(instance.options.fallbackLng).toEqual(['es']);
  });
});
