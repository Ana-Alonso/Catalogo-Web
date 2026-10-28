import { describe, expect, it } from 'vitest';
import type { CatalogItem } from '../../types/catalog';
import {
  getWorkshopSignupState,
  hasWorkshopHappened,
  isWorkshopRegistrationClosed,
} from '../workshopSignupState';

const baseItem: CatalogItem = {
  id: 'w-1',
  title: 'Taller de acuarela',
  description: 'Acuarela para principiantes',
  image: '/acuarela.jpg',
  category: 'talleres',
  status: 'disponible',
};

const itemWith = (overrides: Partial<CatalogItem>): CatalogItem => ({
  ...baseItem,
  ...overrides,
});

describe('isWorkshopRegistrationClosed', () => {
  it('no cierra sin plazo', () => {
    expect(isWorkshopRegistrationClosed(undefined, Date.now())).toBe(false);
    expect(isWorkshopRegistrationClosed(null, Date.now())).toBe(false);
  });

  it('no cierra con plazo válido antes de la fecha límite', () => {
    expect(
      isWorkshopRegistrationClosed('2026-12-01T23:00:00.000Z', Date.parse('2026-11-01T00:00:00.000Z'))
    ).toBe(false);
  });

  it('cierra al alcanzar la fecha límite', () => {
    const deadline = '2026-11-10T23:00:00.000Z';
    expect(isWorkshopRegistrationClosed(deadline, Date.parse(deadline))).toBe(true);
    expect(
      isWorkshopRegistrationClosed(deadline, Date.parse('2026-11-11T00:00:00.000Z'))
    ).toBe(true);
  });

  it('no cierra con nowMs de SSR o plazo ilegible', () => {
    expect(isWorkshopRegistrationClosed('2020-01-01T00:00:00.000Z', 0)).toBe(false);
    expect(isWorkshopRegistrationClosed('mañana', Date.now())).toBe(false);
  });
});

describe('hasWorkshopHappened', () => {
  it('detecta talleres ya celebrados y descarta fechas futuras o ilegibles', () => {
    const now = Date.parse('2026-11-05T12:00:00.000Z');
    expect(hasWorkshopHappened('2026-11-04T18:00:00.000Z', now)).toBe(true);
    expect(hasWorkshopHappened('2026-11-06T18:00:00.000Z', now)).toBe(false);
    expect(hasWorkshopHappened(undefined, now)).toBe(false);
    expect(hasWorkshopHappened('próximamente', now)).toBe(false);
    expect(hasWorkshopHappened('2026-11-04T18:00:00.000Z', 0)).toBe(false);
  });
});

describe('getWorkshopSignupState', () => {
  const now = Date.parse('2026-11-05T12:00:00.000Z');

  it('da prioridad al taller terminado', () => {
    expect(
      getWorkshopSignupState(
        itemWith({ status: 'vendido', cupo: 8, registrationDeadline: '2020-01-01T00:00:00.000Z' }),
        2,
        now
      )
    ).toBe('terminado');
  });

  it('da prioridad al plazo cerrado sobre el taller lleno', () => {
    expect(
      getWorkshopSignupState(
        itemWith({ cupo: 2, registrationDeadline: '2026-11-01T00:00:00.000Z' }),
        5,
        now
      )
    ).toBe('cerrado');
  });

  it('marca lleno al agotar el cupo', () => {
    expect(getWorkshopSignupState(itemWith({ cupo: 2 }), 2, now)).toBe('lleno');
    expect(getWorkshopSignupState(itemWith({ cupo: 0 }), 0, now)).toBe('lleno');
  });

  it('mantiene abierto sin cupo o con plazas', () => {
    expect(getWorkshopSignupState(itemWith({}), undefined, now)).toBe('abierto');
    expect(getWorkshopSignupState(itemWith({ cupo: 8 }), 3, now)).toBe('abierto');
  });

  it('no cierra mientras nowMs vale 0', () => {
    expect(
      getWorkshopSignupState(itemWith({ registrationDeadline: '2020-01-01T00:00:00.000Z' }), 1, 0)
    ).toBe('abierto');
  });

  it('ignora un plazo ilegible', () => {
    expect(
      getWorkshopSignupState(itemWith({ registrationDeadline: '15 Nov 2026 - 18:00h' }), 1, now)
    ).toBe('abierto');
  });

  it('marca terminado cuando el taller ya se celebró', () => {
    expect(
      getWorkshopSignupState(itemWith({ eventDate: '2026-11-04T18:00:00.000Z' }), 1, now)
    ).toBe('terminado');
  });

  it('da prioridad al plazo cerrado sobre el lleno y no al revés', () => {
    expect(
      getWorkshopSignupState(
        itemWith({ cupo: 1, registrationDeadline: '2026-11-05T11:59:00.000Z' }),
        1,
        now
      )
    ).toBe('cerrado');
  });

  it('ignora una fecha de taller ilegible', () => {
    expect(getWorkshopSignupState(itemWith({ eventDate: 'próximamente' }), 1, now)).toBe('abierto');
  });
});
