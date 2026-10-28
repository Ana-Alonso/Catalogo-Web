import type { CatalogItem } from '../types/catalog';

export type WorkshopSignupState = 'abierto' | 'lleno' | 'cerrado' | 'terminado';

const parseDateMs = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

export const isWorkshopRegistrationClosed = (
  deadline: string | null | undefined,
  nowMs: number
): boolean => {
  if (nowMs <= 0) {
    return false;
  }
  const deadlineMs = parseDateMs(deadline);
  if (deadlineMs === null) {
    return false;
  }
  return nowMs >= deadlineMs;
};

export const hasWorkshopHappened = (
  eventDate: string | null | undefined,
  nowMs: number
): boolean => {
  if (nowMs <= 0) {
    return false;
  }
  const eventMs = parseDateMs(eventDate);
  if (eventMs === null) {
    return false;
  }
  return nowMs >= eventMs;
};

export const getWorkshopSignupState = (
  item: CatalogItem,
  spotsCount: number | undefined,
  nowMs: number
): WorkshopSignupState => {
  if (item.status === 'vendido') {
    return 'terminado';
  }

  if (hasWorkshopHappened(item.eventDate, nowMs)) {
    return 'terminado';
  }

  if (isWorkshopRegistrationClosed(item.registrationDeadline, nowMs)) {
    return 'cerrado';
  }

  const cupo = item.cupo ?? null;
  if (cupo !== null && (spotsCount ?? 0) >= cupo) {
    return 'lleno';
  }

  return 'abierto';
};
