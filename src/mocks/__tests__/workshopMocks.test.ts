import { describe, expect, it } from 'vitest';
import { mockCatalogItems } from '../catalogMocks';
import { mockRegistrations } from '../registrationMocks';
import {
  getWorkshopFinishedReason,
  groupWorkshops,
} from '../../utils/workshopPhase';
import { getWorkshopSignupState } from '../../utils/workshopSignupState';
import type { WorkshopSignupState } from '../../utils/workshopSignupState';

const workshops = mockCatalogItems.filter(
  (item) => item.category === 'talleres'
);

const counts = mockRegistrations.reduce<Record<string, number>>(
  (accumulated, registration) => {
    if (registration.status !== 'cancelado') {
      accumulated[registration.product_id] =
        (accumulated[registration.product_id] ?? 0) + 1;
    }
    return accumulated;
  },
  {}
);

describe('mocks de talleres', () => {
  it('cubre todos los estados públicos de inscripción', () => {
    const now = Date.now();
    const states = new Set<WorkshopSignupState>(
      workshops
        .filter((workshop) => workshop.isVisible !== false)
        .map((workshop) =>
          getWorkshopSignupState(workshop, counts[workshop.id] ?? 0, now)
        )
    );

    expect(states).toEqual(
      new Set<WorkshopSignupState>([
        'abierto',
        'lleno',
        'cerrado',
        'terminado',
        'cancelado',
      ])
    );
  });

  it('cubre todos los motivos de taller finalizado en admin', () => {
    const now = Date.now();
    const groups = groupWorkshops(workshops, now);
    const reasons = new Set(
      groups.finished.map((workshop) =>
        getWorkshopFinishedReason(workshop, now)
      )
    );

    expect(groups.active.length).toBeGreaterThan(0);
    expect(reasons).toEqual(new Set(['celebrado', 'cancelado', 'vendido']));
  });

  it('incluye un taller archivado con contacto protegido', () => {
    const archived = workshops.filter(
      (workshop) => workshop.isVisible === false
    );

    expect(archived.length).toBeGreaterThan(0);
    expect(
      mockRegistrations.some(
        (registration) =>
          archived.some((workshop) => workshop.id === registration.product_id) &&
          registration.marketing_consent
      )
    ).toBe(true);
  });

  it('incluye inscripciones en todos los estados', () => {
    const statuses = new Set(
      mockRegistrations.map((registration) => registration.status)
    );

    expect(statuses).toEqual(
      new Set(['pendiente', 'confirmado', 'cancelado'])
    );
  });
});
