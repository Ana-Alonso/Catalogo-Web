import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export const ADMIN_TABS = ['productos', 'talleres', 'archivados'] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];

export const DEFAULT_ADMIN_TAB: AdminTab = 'productos';

export const isAdminTab = (value: string | null): value is AdminTab =>
  value !== null && (ADMIN_TABS as readonly string[]).includes(value);

export const useAdminTab = (): {
  activeTab: AdminTab;
  setTab: (tab: AdminTab) => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = isAdminTab(tabParam) ? tabParam : DEFAULT_ADMIN_TAB;

  const setTab = useCallback(
    (tab: AdminTab) => {
      setSearchParams({ tab });
    },
    [setSearchParams]
  );

  return { activeTab, setTab };
};
