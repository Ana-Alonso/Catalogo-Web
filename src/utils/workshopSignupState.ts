import type { CatalogItem } from '../types/catalog';

export type WorkshopSignupState = 'abierto' | 'lleno' | 'cerrado' | 'terminado';

export const isWorkshopRegistrationClosed = (
  deadline: string | null | undefined,
  nowMs: number
): boolean => {
  if (!deadline || nowMs <= 0) {
    return false;
  }
  const deadlineMs = new Date(deadline).getTime();
  if (Number.isNaN(deadlineMs)) {
    return false;
  }
  return nowMs >= deadlineMs;
};

export const getWorkshopSignupState = (
  item: CatalogItem,
  spotsCount: number | undefined,
  nowMs: number
): WorkshopSignupState => {
  if (item.status === 'vendido') {
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
