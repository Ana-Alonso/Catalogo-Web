import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_SITE_URL,
  getAbsoluteUrl,
  getSiteUrl,
} from '../site';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('site', () => {
  it('usa el dominio de producción como valor por defecto', () => {
    expect(DEFAULT_SITE_URL).toBe('https://laurelenlienzo.vercel.app');
  });

  it('prioriza VITE_SITE_URL y elimina la barra final', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.com/');

    expect(getSiteUrl()).toBe('https://example.com');
  });

  it('usa el origen del navegador cuando no hay variable configurada', () => {
    expect(getSiteUrl()).toBe(window.location.origin);
  });

  it('vuelve al dominio por defecto cuando no existe window', () => {
    vi.stubGlobal('window', undefined);

    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });

  it('normaliza rutas con y sin barra inicial', () => {
    vi.stubGlobal('window', undefined);

    expect(getAbsoluteUrl('es')).toBe(`${DEFAULT_SITE_URL}/es`);
    expect(getAbsoluteUrl('/en')).toBe(`${DEFAULT_SITE_URL}/en`);
  });
});
