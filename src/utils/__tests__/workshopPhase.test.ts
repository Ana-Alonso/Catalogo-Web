import { describe, expect, it } from 'vitest';
import type { CatalogItem } from '../../types/catalog';
import {
  getWorkshopFinishedReason,
  getWorkshopPhase,
  groupWorkshops,
} from '../workshopPhase';

const NOW = Date.parse('2026-11-05T12:00:00.000Z');

const workshop = (overrides: Partial<CatalogItem> = {}): CatalogItem => ({
  id: 'w-1',
  title: 'Taller',
  description: 'Descripción',
  image: '/taller.jpg',
  category: 'talleres',
  status: 'disponible',
  isVisible: true,
  ...overrides,
});

describe('getWorkshopFinishedReason', () => {
  it('marca como activo un taller futuro', () => {
    expect(getWorkshopFinishedReason(workshop({ eventDate: '2026-12-01T18:00:00.000Z' }), NOW)).toBeNull();
  });

  it('marca como activo un taller sin fecha', () => {
    expect(getWorkshopFinishedReason(workshop(), NOW)).toBeNull();
  });

  it('marca como celebrado un taller cuya fecha ya pasó', () => {
    expect(getWorkshopFinishedReason(workshop({ eventDate: '2026-11-04T18:00:00.000Z' }), NOW)).toBe(
      'celebrado'
    );
  });

  it('marca como vendido un taller agotado aunque tenga fecha futura', () => {
    expect(
      getWorkshopFinishedReason(
        workshop({ status: 'vendido', eventDate: '2026-12-01T18:00:00.000Z' }),
        NOW
      )
    ).toBe('vendido');
  });

  it('marca como archivado un taller oculto', () => {
    expect(getWorkshopFinishedReason(workshop({ isVisible: false }), NOW)).toBe('archivado');
  });

  it('no finaliza con nowMs de SSR o una fecha ilegible', () => {
    expect(getWorkshopFinishedReason(workshop({ eventDate: '2026-11-04T18:00:00.000Z' }), 0)).toBeNull();
    expect(getWorkshopFinishedReason(workshop({ eventDate: 'próximamente' }), NOW)).toBeNull();
  });
});

describe('getWorkshopPhase', () => {
  it('clasifica activos y finalizados', () => {
    expect(getWorkshopPhase(workshop({ eventDate: '2026-12-01T18:00:00.000Z' }), NOW)).toBe('activo');
    expect(getWorkshopPhase(workshop({ eventDate: '2026-11-04T18:00:00.000Z' }), NOW)).toBe('finalizado');
  });
});

describe('groupWorkshops', () => {
  it('separa activos y finalizados y excluye los archivados', () => {
    const groups = groupWorkshops(
      [
        workshop({ id: 'futuro', eventDate: '2026-12-01T18:00:00.000Z' }),
        workshop({ id: 'pasado', eventDate: '2026-11-04T18:00:00.000Z' }),
        workshop({ id: 'archivado', isVisible: false }),
        workshop({ id: 'sin-fecha' }),
        workshop({ id: 'vendido', status: 'vendido' }),
      ],
      NOW
    );

    expect(groups.active.map((item) => item.id)).toEqual(['futuro', 'sin-fecha']);
    expect(groups.finished.map((item) => item.id)).toEqual(['pasado', 'vendido']);
  });

  it('ignora productos que no son talleres', () => {
    const groups = groupWorkshops(
      [workshop({ id: 'obra', category: 'ilustraciones' })],
      NOW
    );

    expect(groups).toEqual({ active: [], finished: [] });
  });

  it('ordena los finalizados del más reciente al más antiguo', () => {
    const groups = groupWorkshops(
      [
        workshop({ id: 'antiguo', eventDate: '2026-01-01T18:00:00.000Z' }),
        workshop({ id: 'reciente', eventDate: '2026-11-01T18:00:00.000Z' }),
      ],
      NOW
    );

    expect(groups.finished.map((item) => item.id)).toEqual(['reciente', 'antiguo']);
  });
});
