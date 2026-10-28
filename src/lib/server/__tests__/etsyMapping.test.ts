import { describe, expect, it } from 'vitest';
import { mapEtsyListing } from '../etsyMapping';
import type { EtsyListing } from '../etsyClient';

const baseListing: EtsyListing = {
  listing_id: 123456,
  title: 'Ilustración original',
  description: 'Una ilustración hecha a mano.',
  state: 'active',
  quantity: 1,
  url: 'https://www.etsy.com/listing/123456/ilustracion',
  price: { amount: 2500, divisor: 100, currency_code: 'EUR' },
  images: [
    { rank: 2, url_fullxfull: 'https://i.etsystatic.com/second.jpg' },
    { rank: 1, url_fullxfull: 'https://i.etsystatic.com/first.jpg' },
  ],
};

describe('mapEtsyListing', () => {
  it('maps core listing data to product fields', () => {
    const mapped = mapEtsyListing(baseListing);

    expect(mapped.title).toBe('Ilustración original');
    expect(mapped.priceCents).toBe(2500);
    expect(mapped.currency).toBe('EUR');
    expect(mapped.image).toBe('https://i.etsystatic.com/first.jpg');
    expect(mapped.status).toBe('disponible');
    expect(mapped.isVisible).toBe(true);
    expect(mapped.source).toBe('etsy');
    expect(mapped.etsyListingId).toBe(123456);
    expect(mapped.etsyLink).toBe(baseListing.url);
  });

  it('truncates titles to the database limit', () => {
    const mapped = mapEtsyListing({ ...baseListing, title: 'a'.repeat(200) });
    expect(mapped.title).toHaveLength(120);
    expect(mapped.title.endsWith('…')).toBe(true);
  });

  it('cuts long titles on a word boundary', () => {
    const mapped = mapEtsyListing({
      ...baseListing,
      title: `${'Ilustración artesanal '.repeat(10)}final`,
    });

    expect(mapped.title.length).toBeLessThanOrEqual(120);
    expect(mapped.title.endsWith('…')).toBe(true);
    expect(mapped.title).not.toMatch(/\s…$/);
  });

  it('strips HTML from titles and descriptions', () => {
    const mapped = mapEtsyListing({
      ...baseListing,
      title: '<b>Obra</b> &amp; más',
      description:
        '<style>.x{color:red}</style><p>Hola <strong>mundo</strong></p><script>alert(1)</script>',
    });

    expect(mapped.title).toBe('Obra & más');
    expect(mapped.description).toBe('Hola mundo');
  });

  it('limits descriptions to 2000 characters', () => {
    const mapped = mapEtsyListing({ ...baseListing, description: 'x'.repeat(5000) });
    expect(mapped.description).toHaveLength(2000);
  });

  it('converts prices with a divisor of one', () => {
    const mapped = mapEtsyListing({
      ...baseListing,
      price: { amount: 25, divisor: 1, currency_code: 'usd' },
    });
    expect(mapped.priceCents).toBe(2500);
    expect(mapped.currency).toBe('USD');
  });

  it('returns a null price when the Etsy price is invalid', () => {
    const mapped = mapEtsyListing({
      ...baseListing,
      price: { amount: 25, divisor: 0, currency_code: 'EUR' },
    });
    expect(mapped.priceCents).toBeNull();
  });

  it('falls back to EUR for unsupported currencies', () => {
    const mapped = mapEtsyListing({
      ...baseListing,
      price: { amount: 25, divisor: 1, currency_code: 'EURO' },
    });
    expect(mapped.currency).toBe('EUR');
  });

  it('marks non-active listings as hidden and sold', () => {
    const mapped = mapEtsyListing({
      ...baseListing,
      state: 'sold_out',
      quantity: 0,
    });
    expect(mapped.isVisible).toBe(false);
    expect(mapped.status).toBe('vendido');
    expect(mapped.etsyState).toBe('sold_out');
  });

  it('builds an Etsy URL when the listing has none', () => {
    const mapped = mapEtsyListing({ ...baseListing, url: undefined });
    expect(mapped.etsyLink).toBe('https://www.etsy.com/listing/123456');
  });
});
