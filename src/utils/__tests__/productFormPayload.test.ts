import { describe, expect, it } from 'vitest';
import {
  resolveCancelledReset,
  resolveWorkshopPayload,
} from '../productFormPayload';
import type { ProductFormData } from '../../types/catalog';

const form = (overrides: Partial<ProductFormData> = {}): ProductFormData => ({
  title: 'Producto',
  description: 'Descripción',
  category: 'ilustraciones',
  status: 'disponible',
  ...overrides,
});

describe('resolveWorkshopPayload', () => {
  it('incluye los campos de reserva en talleres', () => {
    expect(
      resolveWorkshopPayload(
        form({
          category: 'talleres',
          eventDate: '2026-12-01T18:00',
          eventLocation: 'Estudio',
          cupo: '12',
        })
      )
    ).toEqual({
      eventDate: '2026-12-01T18:00',
      eventLocation: 'Estudio',
      cupo: 12,
      registrationDeadline: null,
    });
  });

  it('incluye solo cupo y plazo en especiales', () => {
    expect(resolveWorkshopPayload(form({ category: 'especiales', cupo: '25' }))).toEqual({
      cupo: 25,
      registrationDeadline: null,
    });
  });

  it('omite los campos en categorías sin reservas', () => {
    expect(resolveWorkshopPayload(form({ category: 'textiles', cupo: '10' }))).toEqual({});
  });
});

describe('resolveCancelledReset', () => {
  it('no resetea la cancelación en categorías reservables', () => {
    expect(resolveCancelledReset(form({ category: 'talleres' }))).toEqual({});
    expect(resolveCancelledReset(form({ category: 'especiales' }))).toEqual({});
  });

  it('resetea la cancelación fuera de las categorías reservables', () => {
    expect(resolveCancelledReset(form({ category: 'ilustraciones' }))).toEqual({
      workshopCancelled: false,
    });
  });
});
