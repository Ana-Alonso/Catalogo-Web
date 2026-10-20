import { describe, expect, it } from 'vitest';
import { resolvePurchaseLinks } from '../productLinks';

describe('resolvePurchaseLinks', () => {
  it('elimina los enlaces de compra en talleres', () => {
    expect(
      resolvePurchaseLinks(
        'talleres',
        'https://www.etsy.com/listing/1',
        'https://www.vinted.es/items/1'
      )
    ).toEqual({});
  });

  it('conserva los enlaces de compra en el resto de categorías', () => {
    expect(
      resolvePurchaseLinks(
        'ilustraciones',
        ' https://www.etsy.com/listing/1 ',
        'https://www.vinted.es/items/1'
      )
    ).toEqual({
      etsyLink: 'https://www.etsy.com/listing/1',
      vintedLink: 'https://www.vinted.es/items/1',
    });
  });

  it('descarta enlaces vacíos', () => {
    expect(resolvePurchaseLinks('camisetas', '   ', '')).toEqual({});
  });
});
