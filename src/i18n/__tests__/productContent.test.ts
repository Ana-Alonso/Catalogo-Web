import { describe, expect, it } from 'vitest';
import {
  localizeCatalogItem,
  localizeCatalogItems,
} from '../productContent';
import type { CatalogItem } from '../../types/catalog';

const sourceDescription = [
  'Ilustración digital en blanco y negro de una obra original.',
  'Tamaño recomendado de impresión 210 x 297 cm o menos, y un gramaje de 200 - 300 gramos.',
  'Esta obra es solo para uso personal. Está prohibida su reventa, redistribución o uso comercial.',
].join('\n');

const englishDescription = [
  'Digital black and white illustration of an original artwork.',
  'Recommended print size: 210 x 297 cm or smaller, with a paper weight of 200–300 grams.',
  'This artwork is for personal use only. Resale, redistribution or commercial use is prohibited.',
].join('\n');

const createItem = (overrides: Partial<CatalogItem> = {}): CatalogItem => ({
  id: 'product-1',
  title: '2MOTHS',
  description: sourceDescription,
  category: 'ilustraciones',
  image: 'https://example.com/product.png',
  status: 'disponible',
  featured: false,
  ...overrides,
});

describe('productContent', () => {
  it('traduce la descripción conocida al inglés', () => {
    const localized = localizeCatalogItem(createItem(), 'en');

    expect(localized.description).toBe(englishDescription);
    expect(localized.title).toBe('2MOTHS');
  });

  it('traduce título, descripción y ubicación de forma independiente', () => {
    const item = createItem({
      title: 'Obra de Prueba I',
      description: 'Pieza de muestra para desarrollo y previsualización de catálogo.',
      eventLocation: 'Estudio Laurel / Presencial',
    });

    const localized = localizeCatalogItem(item, 'en');

    expect(localized.title).toBe('Sample Artwork I');
    expect(localized.description).toBe(
      'Sample piece for development and catalog preview.'
    );
    expect(localized.eventLocation).toBe('Laurel Studio / In person');
  });

  it('mantiene el texto original cuando no hay traducción', () => {
    const item = createItem({
      title: 'Título sin traducción',
      description: 'Descripción sin traducción',
      eventLocation: 'Ubicación sin traducción',
    });

    expect(localizeCatalogItem(item, 'en')).toMatchObject({
      title: 'Título sin traducción',
      description: 'Descripción sin traducción',
      eventLocation: 'Ubicación sin traducción',
    });
  });

  it('devuelve el mismo item y array en español', () => {
    const item = createItem();
    const items = [item];

    expect(localizeCatalogItem(item, 'es')).toBe(item);
    expect(localizeCatalogItems(items, 'es')).toBe(items);
  });

  it('normaliza CRLF, NBSP y espacios exteriores', () => {
    const item = createItem({
      description: `  ${sourceDescription
        .replace(/ /g, '\u00a0')
        .replace(/\n/g, '\r\n')}  `,
    });

    expect(localizeCatalogItem(item, 'en').description).toBe(englishDescription);
  });

  it('no muta el item original y devuelve una copia', () => {
    const item = createItem();
    const localized = localizeCatalogItem(item, 'en');

    expect(localized).not.toBe(item);
    expect(item.description).toBe(sourceDescription);
    expect(localized.description).toBe(englishDescription);
  });

  it('mantiene campos opcionales vacíos', () => {
    const item = createItem({ description: '', eventLocation: undefined });
    const localized = localizeCatalogItem(item, 'en');

    expect(localized.description).toBe('');
    expect(localized.eventLocation).toBeUndefined();
  });

  it('localiza todos los elementos en inglés', () => {
    const items = [
      createItem(),
      createItem({
        id: 'product-2',
        description: 'Pieza de muestra para desarrollo y previsualización de catálogo.',
      }),
    ];

    const localized = localizeCatalogItems(items, 'en');

    expect(localized).toHaveLength(2);
    expect(localized[0]).not.toBe(items[0]);
    expect(localized[1].description).toBe(
      'Sample piece for development and catalog preview.'
    );
  });
});
