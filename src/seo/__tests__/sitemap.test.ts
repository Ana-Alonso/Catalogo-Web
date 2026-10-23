import { describe, expect, it } from 'vitest';
import { buildSitemap } from '../sitemap';

describe('buildSitemap', () => {
  it('incluye las versiones española e inglesa con alternates', () => {
    const xml = buildSitemap('https://example.com');

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<loc>https://example.com/es</loc>');
    expect(xml).toContain('<loc>https://example.com/en</loc>');
    expect(xml).toContain('hreflang="es" href="https://example.com/es"');
    expect(xml).toContain('hreflang="en" href="https://example.com/en"');
    expect(xml).toContain(
      'hreflang="x-default" href="https://example.com/es"'
    );
  });

  it('escapa caracteres especiales en las URLs', () => {
    const xml = buildSitemap('https://example.com', ['/es?x=1&y=2']);

    expect(xml).toContain('<loc>https://example.com/es?x=1&amp;y=2</loc>');
    expect(xml).not.toContain('<loc>https://example.com/es?x=1&y=2</loc>');
  });

  it('acepta rutas sin barra inicial', () => {
    const xml = buildSitemap('https://example.com', ['en']);

    expect(xml).toContain('<loc>https://example.com/en</loc>');
  });

  it('escapa comillas y apóstrofes del dominio', () => {
    const xml = buildSitemap("https://example.com/o'reilly", ['/es']);

    expect(xml).toContain('https://example.com/o&apos;reilly/es');
  });

  it('normaliza el dominio sin barra final', () => {
    const xml = buildSitemap('https://example.com/', ['/es']);

    expect(xml).toContain('<loc>https://example.com/es</loc>');
    expect(xml).not.toContain('https://example.com//es');
  });

  it('genera un urlset sin entradas cuando no hay rutas', () => {
    const xml = buildSitemap('https://example.com', []);

    expect(xml).toContain('<urlset');
    expect(xml).not.toContain('<url>');
  });

  it('mantiene el orden de las rutas recibidas', () => {
    const xml = buildSitemap('https://example.com', ['/en', '/es']);

    expect(xml.indexOf('/en</loc>')).toBeLessThan(xml.indexOf('/es</loc>'));
  });
});
