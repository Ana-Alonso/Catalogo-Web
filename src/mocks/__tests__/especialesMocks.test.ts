import { describe, expect, it } from 'vitest';
import { mockCatalogItems } from '../catalogMocks';
import { mockRegistrations } from '../registrationMocks';
import { usesReservationFlow } from '../../utils/reservableProduct';
import { getWorkshopSignupState } from '../../utils/workshopSignupState';
import type { WorkshopSignupState } from '../../utils/workshopSignupState';

const specials = mockCatalogItems.filter(
  (item) => item.category === 'especiales'
);

const takenUnits = mockRegistrations.reduce<Record<string, number>>(
  (accumulated, registration) => {
    if (registration.status !== 'cancelado') {
      accumulated[registration.product_id] =
        (accumulated[registration.product_id] ?? 0) + (registration.quantity || 1);
    }
    return accumulated;
  },
  {}
);

describe('mocks de ediciones especiales', () => {
  it('cubre todos los estados públicos de reserva por unidades', () => {
    const now = Date.now();
    const states = new Set<WorkshopSignupState>(
      specials
        .filter((item) => item.isVisible !== false && usesReservationFlow(item))
        .map((item) => getWorkshopSignupState(item, takenUnits[item.id] ?? 0, now))
    );

    expect(states).toEqual(
      new Set<WorkshopSignupState>(['abierto', 'lleno', 'cerrado', 'cancelado'])
    );
  });

  it('muestra reservas parciales y llenado por unidades acumuladas', () => {
    expect(takenUnits['mock-especiales-unidades']).toBe(3);
    expect(takenUnits['mock-especiales-full']).toBe(2);
  });

  it('mantiene abierto el especial sin cupo pese a una reserva de 10 unidades', () => {
    const state = getWorkshopSignupState(
      specials.find((item) => item.id === 'mock-especiales-unlimited')!,
      takenUnits['mock-especiales-unlimited'] ?? 0,
      Date.now()
    );

    expect(state).toBe('abierto');
  });

  it('ignora la fecha heredada y no activa las reservas sin cupo ni plazo', () => {
    const legacy = specials.find((item) => item.id === 'mock-especiales-fecha-heredada');

    expect(legacy?.eventDate).toBeTruthy();
    expect(legacy && usesReservationFlow(legacy)).toBe(false);
  });
});
