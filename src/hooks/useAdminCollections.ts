import { useMemo } from 'react';
import { useNow } from './useNow';
import { getProtectedWorkshopIds } from '../utils/workshopSummary';
import { groupWorkshops } from '../utils/workshopPhase';
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
    () => products.filter((product) => product.category === 'talleres'),
    [products]
  );

  const workshopGroups = useMemo(
    () => groupWorkshops(products, nowMs),
    [products, nowMs]
  );

  const tabCounts = {
    catalogo: visibleProducts.length,
    talleres: workshopGroups.active.length,
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
