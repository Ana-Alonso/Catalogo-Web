import { describe, it, expect } from 'vitest';
import {
  parsePriceToCents,
  formatPrice,
  getDiscountedCents,
  getOfferPercent,
  isOfferActive,
} from '../price';

const normalize = (value: string): string => value.replace(/\u00a0/g, ' ');

describe('parsePriceToCents', () => {
  it('devuelve null con valores vacíos o sin dígitos', () => {
    expect(parsePriceToCents(undefined)).toBeNull();
    expect(parsePriceToCents(null)).toBeNull();
    expect(parsePriceToCents('')).toBeNull();
    expect(parsePriceToCents('Consultar')).toBeNull();
  });

  it('convierte importes con coma decimal y símbolo', () => {
    expect(parsePriceToCents('25,50 €')).toBe(2550);
  });

  it('convierte importes con punto decimal', () => {
    expect(parsePriceToCents('25.50')).toBe(2550);
    expect(parsePriceToCents('25')).toBe(2500);
  });

  it('interpreta el punto como separador de miles cuando hay coma', () => {
    expect(parsePriceToCents('1.250,00 €')).toBe(125000);
  });

  it('admite el cero', () => {
    expect(parsePriceToCents('0')).toBe(0);
  });
});

describe('formatPrice', () => {
  it('formatea euros en es-ES', () => {
    const formatted = normalize(formatPrice(2550, 'EUR'));
    expect(formatted).toContain('25,50');
    expect(formatted).toContain('€');
  });

  it('usa EUR por defecto y normaliza el código', () => {
    expect(normalize(formatPrice(1000))).toContain('10,00');
    expect(normalize(formatPrice(1000, 'usd'))).toContain('US$');
  });

  it('devuelve cadena vacía sin importe', () => {
    expect(formatPrice(null, 'EUR')).toBe('');
  });

  it('usa EUR cuando el código de moneda no es válido', () => {
    expect(normalize(formatPrice(1000, 'EUROS'))).toContain('10,00 €');
  });
});

describe('getDiscountedCents', () => {
  it('aplica el porcentaje redondeando al céntimo', () => {
    expect(getDiscountedCents(2500, 20)).toBe(2000);
    expect(getDiscountedCents(999, 10)).toBe(899);
  });

  it('mantiene el importe sin descuento o fuera de rango', () => {
    expect(getDiscountedCents(2500, null)).toBe(2500);
    expect(getDiscountedCents(2500, 0)).toBe(2500);
    expect(getDiscountedCents(2500, 95)).toBe(2500);
  });

  it('devuelve null sin importe', () => {
    expect(getDiscountedCents(null, 20)).toBeNull();
  });
});

describe('getOfferPercent', () => {
  it('usa el descuento manual en productos locales', () => {
    expect(
      getOfferPercent({
        source: 'local',
        priceCents: 2500,
        discountPercent: 20,
        etsyOfferPercent: null,
      })
    ).toBe(20);
  });

  it('usa la oferta de Etsy en productos importados', () => {
    expect(
      getOfferPercent({
        source: 'etsy',
        priceCents: 495,
        discountPercent: null,
        etsyOfferPercent: 15,
      })
    ).toBe(15);
  });

  it('ignora el descuento manual en productos de Etsy', () => {
    expect(
      getOfferPercent({
        source: 'etsy',
        priceCents: 495,
        discountPercent: 20,
        etsyOfferPercent: null,
      })
    ).toBeNull();
  });

  it('ignora la oferta de Etsy en productos locales', () => {
    expect(
      getOfferPercent({
        source: 'local',
        priceCents: 2500,
        discountPercent: null,
        etsyOfferPercent: 30,
      })
    ).toBeNull();
  });

  it('descarta porcentajes fuera de rango o sin precio', () => {
    expect(
      getOfferPercent({ source: 'local', priceCents: 2500, discountPercent: 95 })
    ).toBeNull();
    expect(
      getOfferPercent({ source: 'etsy', priceCents: 495, etsyOfferPercent: 0 })
    ).toBeNull();
    expect(
      getOfferPercent({ source: 'etsy', priceCents: null, etsyOfferPercent: 10 })
    ).toBeNull();
  });
});

describe('isOfferActive', () => {
  it('es cierto para ofertas locales y también para ofertas de Etsy', () => {
    expect(
      isOfferActive({
        source: 'local',
        priceCents: 2500,
        discountPercent: 20,
      })
    ).toBe(true);
    expect(
      isOfferActive({ source: 'etsy', priceCents: 495, etsyOfferPercent: 15 })
    ).toBe(true);
  });

  it('es falso cuando el porcentaje pertenece al otro origen', () => {
    expect(
      isOfferActive({ source: 'etsy', priceCents: 495, discountPercent: 15 })
    ).toBe(false);
    expect(
      isOfferActive({ source: 'local', priceCents: 2500, etsyOfferPercent: 15 })
    ).toBe(false);
  });

  it('es falso sin precio o sin porcentaje', () => {
    expect(
      isOfferActive({ source: 'local', priceCents: null, discountPercent: 20 })
    ).toBe(false);
    expect(
      isOfferActive({ source: 'local', priceCents: 2500, discountPercent: null })
    ).toBe(false);
  });
});
