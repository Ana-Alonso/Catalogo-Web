import { useMemo } from 'react';
import { useNow } from './useNow';
import { getProtectedWorkshopIds } from '../utils/workshopSummary';
import { groupWorkshops } from '../utils/workshopPhase';
import { isReservationCategory } from '../utils/reservableProduct';
import type { CatalogItem } from '../types/catalog';
import type { WorkshopRegistration } from '../types/registrations';

export const useAdminCollections = (
  products: CatalogItem[],
  registrations: WorkshopRegistration[]
) => {
  const nowMs = useNow();

  const visibleProducts = useMemo(
    () => products.filter((product) => product.isVisible !== false),
    [products]
  );

  const archivedProducts = useMemo(
    () => products.filter((product) => product.isVisible === false),
    [products]
  );

  const protectedProductIds = useMemo(
    () => getProtectedWorkshopIds(registrations),
    [registrations]
  );

  const workshops = useMemo(
    () => products.filter((product) => isReservationCategory(product.category)),
    [products]
  );

  const workshopGroups = useMemo(
    () => groupWorkshops(products, nowMs),
    [products, nowMs]
  );

  const pendingPaymentCount = useMemo(() => {
    const reservationIds = new Set(workshops.map((workshop) => String(workshop.id)));

    return registrations.filter(
      (registration) =>
        registration.status !== 'cancelado' &&
        registration.paid !== true &&
        reservationIds.has(String(registration.product_id))
    ).length;
  }, [registrations, workshops]);

  const tabCounts = {
    catalogo: visibleProducts.length,
    talleres: workshopGroups.active.length,
    pagos: pendingPaymentCount,
    archivados: archivedProducts.length,
  };

  return {
    visibleProducts,
    archivedProducts,
    protectedProductIds,
    workshops,
    tabCounts,
  };
};
