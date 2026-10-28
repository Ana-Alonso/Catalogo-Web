import type { CatalogItem } from '../types/catalog';
import { hasWorkshopHappened } from './workshopSignupState';

export type WorkshopFinishedReason = 'archivado' | 'cancelado' | 'vendido' | 'celebrado';
export type WorkshopPhase = 'activo' | 'finalizado';

export interface WorkshopGroups {
  active: CatalogItem[];
  finished: CatalogItem[];
}

export const getWorkshopFinishedReason = (
  workshop: CatalogItem,
  nowMs: number
): WorkshopFinishedReason | null => {
  if (workshop.isVisible === false) {
    return 'archivado';
  }

  if (workshop.workshopCancelled) {
    return 'cancelado';
  }

  if (workshop.status === 'vendido') {
    return 'vendido';
  }

  if (hasWorkshopHappened(workshop.eventDate, nowMs)) {
    return 'celebrado';
  }

  return null;
};

export const getWorkshopPhase = (
  workshop: CatalogItem,
  nowMs: number
): WorkshopPhase =>
  getWorkshopFinishedReason(workshop, nowMs) === null ? 'activo' : 'finalizado';

const getEventTime = (workshop: CatalogItem): number | null => {
  if (!workshop.eventDate) {
    return null;
  }

  const time = new Date(workshop.eventDate).getTime();
  return Number.isNaN(time) ? null : time;
};

const byEventDate =
  (direction: 1 | -1) =>
  (a: CatalogItem, b: CatalogItem): number => {
    const aTime = getEventTime(a);
    const bTime = getEventTime(b);

    if (aTime === null && bTime === null) {
      return a.title.localeCompare(b.title);
    }

    if (aTime === null) {
      return 1;
    }

    if (bTime === null) {
      return -1;
    }

    return (aTime - bTime) * direction;
  };

export const groupWorkshops = (
  workshops: CatalogItem[],
  nowMs: number
): WorkshopGroups => {
  const candidates = workshops.filter(
    (workshop) => workshop.category === 'talleres' && workshop.isVisible !== false
  );

  const active: CatalogItem[] = [];
  const finished: CatalogItem[] = [];

  candidates.forEach((workshop) => {
    if (getWorkshopPhase(workshop, nowMs) === 'activo') {
      active.push(workshop);
      return;
    }
    finished.push(workshop);
  });

  return {
    active: active.sort(byEventDate(1)),
    finished: finished.sort(byEventDate(-1)),
  };
};
