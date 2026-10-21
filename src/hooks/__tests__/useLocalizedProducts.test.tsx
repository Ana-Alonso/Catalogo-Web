import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import i18n from '../../i18n';
import { useLocalizedProducts } from '../useLocalizedProducts';
import type { CatalogItem } from '../../types/catalog';

const sourceDescription = [
  'Ilustración digital en blanco y negro de una obra original.',
  'Tamaño recomendado de impresión 210 x 297 cm o menos, y un gramaje de 200 - 300 gramos.',
  'Esta obra es solo para uso personal. Está prohibida su reventa, redistribución o uso comercial.',
].join('\n');

const item: CatalogItem = {
  id: 'product-1',
  title: '2MOTHS',
  description: sourceDescription,
  category: 'ilustraciones',
  image: 'https://example.com/product.png',
  status: 'disponible',
  featured: false,
};

describe('useLocalizedProducts', () => {
  it('traduce al cambiar el idioma y vuelve al original', async () => {
    const { result } = renderHook(() => useLocalizedProducts([item]));

    expect(result.current[0].description).toBe(sourceDescription);

    await act(async () => {
      await i18n.changeLanguage('en');
    });

    expect(result.current[0].description).toContain(
      'Digital black and white illustration'
    );

    await act(async () => {
      await i18n.changeLanguage('es');
    });

    expect(result.current[0].description).toBe(sourceDescription);
  });

  it('mantiene el contenido original si no hay traducción', async () => {
    const untranslatedItem = {
      ...item,
      description: 'Descripción sin traducción',
    };
    const { result } = renderHook(() => useLocalizedProducts([untranslatedItem]));

    await act(async () => {
      await i18n.changeLanguage('en');
    });

    expect(result.current[0].description).toBe('Descripción sin traducción');
  });
});
