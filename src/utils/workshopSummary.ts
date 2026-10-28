import type { WorkshopRegistration } from '../types/registrations';

export interface WorkshopRegistrationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  marketing: number;
}

export const getRegistrationStats = (
  registrations: WorkshopRegistration[]
): WorkshopRegistrationStats =>
  registrations.reduce<WorkshopRegistrationStats>(
    (stats, registration) => {
      stats.total += 1;

      if (registration.status === 'pendiente') {
        stats.pending += 1;
      }

      if (registration.status === 'confirmado') {
        stats.confirmed += 1;
      }

      if (registration.status === 'cancelado') {
        stats.cancelled += 1;
      }

      if (registration.marketing_consent) {
        stats.marketing += 1;
      }

      return stats;
    },
    { total: 0, pending: 0, confirmed: 0, cancelled: 0, marketing: 0 }
  );

export const getActiveRegistrationCount = (
  stats: WorkshopRegistrationStats
): number => stats.pending + stats.confirmed;

export const getProtectedWorkshopIds = (
  registrations: WorkshopRegistration[]
): Set<string> =>
  new Set(
    registrations
      .filter((registration) => registration.marketing_consent)
      .map((registration) => registration.product_id)
  );

export const groupRegistrationsByWorkshop = (
  registrations: WorkshopRegistration[]
): Record<string, WorkshopRegistration[]> =>
  registrations.reduce<Record<string, WorkshopRegistration[]>>(
    (groups, registration) => {
      const list = groups[registration.product_id] ?? [];
      groups[registration.product_id] = [...list, registration];
      return groups;
    },
    {}
  );

export const sortRegistrationsByDate = (
  registrations: WorkshopRegistration[]
): WorkshopRegistration[] =>
  [...registrations].sort((a, b) => b.created_at.localeCompare(a.created_at));
