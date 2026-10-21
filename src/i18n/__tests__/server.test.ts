import { describe, expect, it } from 'vitest';
import { resolvePreferredLanguage } from '../server';

const createRequest = (
  path: string,
  headers: Record<string, string> = {}
): Request => new Request(`https://example.com${path}`, { headers });

describe('resolvePreferredLanguage', () => {
  it('prioriza el idioma de la ruta sobre cookie y cabecera', () => {
    const request = createRequest('/en', {
      cookie: 'laurel_lang=es',
      'accept-language': 'es-ES',
    });

    expect(resolvePreferredLanguage(request)).toBe('en');
  });

  it('usa la cookie cuando la ruta no tiene idioma', () => {
    const request = createRequest('/admin', {
      cookie: 'tema=oscuro; laurel_lang=en; sesion=activa',
      'accept-language': 'es-ES',
    });

    expect(resolvePreferredLanguage(request)).toBe('en');
  });

  it('usa Accept-Language cuando no hay ruta ni cookie válida', () => {
    const request = createRequest('/', {
      'accept-language': 'fr-FR,fr;q=0.9,en-GB;q=0.8',
    });

    expect(resolvePreferredLanguage(request)).toBe('en');
  });

  it('ignora idiomas con calidad cero', () => {
    const request = createRequest('/', {
      'accept-language': 'en;q=0,es;q=1',
    });

    expect(resolvePreferredLanguage(request)).toBe('es');
  });

  it('acepta espacios alrededor del parámetro de calidad', () => {
    const request = createRequest('/', {
      'accept-language': 'fr-FR; q=1, es-ES; q=0.9, en-US; q=0.8',
    });

    expect(resolvePreferredLanguage(request)).toBe('es');
  });

  it('usa la cookie válida aunque la ruta tenga un idioma no soportado', () => {
    const request = createRequest('/fr', {
      cookie: 'laurel_lang=en',
      'accept-language': 'es-ES',
    });

    expect(resolvePreferredLanguage(request)).toBe('en');
  });

  it('ignora cookies malformadas y recurre a Accept-Language', () => {
    const request = createRequest('/', {
      cookie: 'laurel_lang=%E0%A4%A',
      'accept-language': 'en-US',
    });

    expect(resolvePreferredLanguage(request)).toBe('en');
  });

  it('cae en español cuando no hay información de idioma', () => {
    expect(resolvePreferredLanguage(createRequest('/'))).toBe('es');
  });

  it('cae en español cuando todos los idiomas son desconocidos', () => {
    const request = createRequest('/', {
      'accept-language': 'de-DE,fr;q=0.8',
    });

    expect(resolvePreferredLanguage(request)).toBe('es');
  });
});
