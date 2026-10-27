import { describe, it, expect } from 'vitest';
import {
  normalizeOfferPercent,
  validateOfferPercent,
  validateProductForm,
  type ProductFormValidationInput,
} from '../productFormValidation';

const baseInput: ProductFormValidationInput = {
  isEditing: false,
  title: 'Obra',
  description: 'Descripción',
  price: '',
  priceOnRequest: false,
  discountPercent: '',
  imageFile: new File(['image'], 'obra.png', { type: 'image/png' }),
  externalImageUrl: '',
};

describe('validateProductForm', () => {
  it('exige título y descripción', () => {
    expect(
      validateProductForm({ ...baseInput, title: '  ' })
    ).toBe('titleDescription');
  });

  it('exige imagen o URL al crear un producto', () => {
    expect(
      validateProductForm({ ...baseInput, imageFile: null })
    ).toBe('image');
  });

  it('rechaza precios no interpretables', () => {
    expect(
      validateProductForm({ ...baseInput, price: 'sin precio' })
    ).toBe('price');
  });

  it('rechaza descuentos fuera del rango permitido', () => {
    expect(
      validateProductForm({
        ...baseInput,
        price: '25',
        discountPercent: '91',
      })
    ).toBe('discountRange');
  });

  it('exige un precio antes de aplicar descuento', () => {
    expect(
      validateProductForm({
        ...baseInput,
        discountPercent: '10',
      })
    ).toBe('discountRequiresPrice');
  });

  it('acepta una edición con URL externa y descuento válido', () => {
    expect(
      validateProductForm({
        ...baseInput,
        isEditing: true,
        imageFile: null,
        externalImageUrl: 'https://example.com/obra.png',
        price: '25',
        discountPercent: '10',
      })
    ).toBeNull();
  });
});

describe('normalizeOfferPercent', () => {
  it('devuelve null con cadena vacía o fuera de rango', () => {
    expect(normalizeOfferPercent('')).toBeNull();
    expect(normalizeOfferPercent('  ')).toBeNull();
    expect(normalizeOfferPercent('0')).toBeNull();
    expect(normalizeOfferPercent('91')).toBeNull();
    expect(normalizeOfferPercent('12,5')).toBeNull();
  });

  it('acepta enteros de 1 a 90', () => {
    expect(normalizeOfferPercent('1')).toBe(1);
    expect(normalizeOfferPercent(' 20 ')).toBe(20);
    expect(normalizeOfferPercent('90')).toBe(90);
  });
});

describe('validateOfferPercent', () => {
  it('permite dejar la oferta vacía', () => {
    expect(validateOfferPercent('', null)).toBeNull();
  });

  it('rechaza porcentajes inválidos aunque haya precio', () => {
    expect(validateOfferPercent('120', 495)).toBe('discountRange');
  });

  it('exige precio cuando el porcentaje es correcto', () => {
    expect(validateOfferPercent('20', null)).toBe('discountRequiresPrice');
    expect(validateOfferPercent('20', 495)).toBeNull();
  });
});
