import { describe, expect, it } from 'vitest';
import type { WorkshopRegistration } from '../../types/registrations';
import {
  getActiveRegistrationCount,
  getProtectedWorkshopIds,
  getRegistrationStats,
  groupRegistrationsByWorkshop,
  sortRegistrationsByDate,
} from '../workshopSummary';

const registration = (
  overrides: Partial<WorkshopRegistration> = {}
): WorkshopRegistration => ({
  id: 'r-1',
  product_id: 'w-1',
  name: 'Ana',
  email: 'ana@test.com',
  status: 'pendiente',
  privacy_consent_at: '2026-11-01T10:00:00.000Z',
  marketing_consent: false,
  created_at: '2026-11-01T10:00:00.000Z',
  ...overrides,
});

describe('getRegistrationStats', () => {
  it('cuenta estados y consentimientos de marketing', () => {
    const stats = getRegistrationStats([
      registration({ id: 'r-1', status: 'pendiente' }),
      registration({ id: 'r-2', status: 'confirmado', marketing_consent: true }),
      registration({ id: 'r-3', status: 'cancelado', marketing_consent: true }),
    ]);

    expect(stats).toEqual({
      total: 3,
      pending: 1,
      confirmed: 1,
      cancelled: 1,
      marketing: 2,
    });
  });

  it('devuelve ceros sin inscripciones', () => {
    expect(getRegistrationStats([])).toEqual({
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      marketing: 0,
    });
  });
});

describe('getActiveRegistrationCount', () => {
  it('suma pendientes y confirmadas', () => {
    expect(
      getActiveRegistrationCount({
        total: 4,
        pending: 2,
        confirmed: 1,
        cancelled: 1,
        marketing: 0,
      })
    ).toBe(3);
  });
});

describe('getProtectedWorkshopIds', () => {
  it('incluye solo talleres con contactos protegidos', () => {
    const ids = getProtectedWorkshopIds([
      registration({ product_id: 'w-1', marketing_consent: true }),
      registration({ product_id: 'w-2' }),
      registration({ product_id: 'w-3', marketing_consent: true }),
    ]);

    expect([...ids]).toEqual(['w-1', 'w-3']);
  });

  it('devuelve un conjunto vacío sin consentimientos', () => {
    expect(getProtectedWorkshopIds([registration()]).size).toBe(0);
  });
});

describe('groupRegistrationsByWorkshop', () => {
  it('agrupa las inscripciones por taller', () => {
    const groups = groupRegistrationsByWorkshop([
      registration({ id: 'r-1', product_id: 'w-1' }),
      registration({ id: 'r-2', product_id: 'w-2' }),
      registration({ id: 'r-3', product_id: 'w-1' }),
    ]);

    expect(groups['w-1'].map((item) => item.id)).toEqual(['r-1', 'r-3']);
    expect(groups['w-2'].map((item) => item.id)).toEqual(['r-2']);
  });
});

describe('sortRegistrationsByDate', () => {
  it('ordena de la más reciente a la más antigua sin mutar la entrada', () => {
    const input = [
      registration({ id: 'antigua', created_at: '2026-09-01T10:00:00.000Z' }),
      registration({ id: 'reciente', created_at: '2026-11-01T10:00:00.000Z' }),
    ];

    expect(sortRegistrationsByDate(input).map((item) => item.id)).toEqual([
      'reciente',
      'antigua',
    ]);
    expect(input.map((item) => item.id)).toEqual(['antigua', 'reciente']);
  });
});
