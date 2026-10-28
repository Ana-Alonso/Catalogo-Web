import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Box } from '../ui';
import { cn } from '../../design-system/utils/cn';
import { ADMIN_TABS, type AdminTab } from '../../hooks/useAdminTab';

interface AdminDashboardTabsProps {
  activeTab: AdminTab;
  counts: Record<AdminTab, number>;
}

const tabLabelKeys = {
  productos: 'admin.tabs.products',
  talleres: 'admin.tabs.workshops',
  archivados: 'admin.tabs.archived',
} as const satisfies Record<AdminTab, string>;

export const AdminDashboardTabs: React.FC<AdminDashboardTabsProps> = ({
  activeTab,
  counts,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      as="nav"
      aria-label={t('admin.tabs.label')}
      display="flex"
      wrap
      gap="xs"
      padding="xs"
      rounded="xl"
      border
      background="subtle"
    >
      {ADMIN_TABS.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <Link
            key={tab}
            to={`/admin?tab=${tab}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
              isActive
                ? 'bg-orange-600 text-white'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            )}
          >
            {t(tabLabelKeys[tab])}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-800 text-neutral-300'
              )}
            >
              {counts[tab]}
            </span>
          </Link>
        );
      })}
    </Box>
  );
};

export default AdminDashboardTabs;
