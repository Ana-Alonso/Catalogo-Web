import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Box, Button, Card, Icon, Typography } from '../../ui';
import { useToast } from '../../../hooks/useToast';
import {
  EtsySyncError,
  triggerEtsySync,
  type EtsySyncErrorCode,
} from '../../../services/etsySyncService';

interface AdminEtsySyncPanelProps {
  onSynced: () => Promise<void>;
}

const syncErrorKeys = {
  notConfigured: 'admin.etsySync.errors.notConfigured',
  unauthorized: 'admin.etsySync.errors.unauthorized',
  unexpectedResponse: 'admin.etsySync.errors.unexpectedResponse',
  unknown: 'admin.etsySync.errors.unknown',
} as const satisfies Record<EtsySyncErrorCode, string>;

export const AdminEtsySyncPanel: React.FC<AdminEtsySyncPanelProps> = ({ onSynced }) => {
  const { t } = useTranslation();
  const { success, error: notifyError } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const result = await triggerEtsySync();
      await onSynced();
      success(
        t('admin.etsySync.success', {
          total: result.total,
          created: result.created,
          updated: result.updated,
          hidden: result.hidden,
        })
      );
    } catch (error) {
      notifyError(
        error instanceof EtsySyncError
          ? t(syncErrorKeys[error.code])
          : error instanceof Error
            ? error.message
            : t('admin.etsySync.error')
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card padding="lg">
      <Box
        display="flex"
        direction="column"
        stackBelow="sm"
        alignSm="center"
        justify="between"
        gap="md"
      >
        <Box>
          <Typography variant="h4" transform="uppercase" tracking="wider">
            {t('admin.etsySync.title')}
          </Typography>
          <Typography variant="body">
            {t('admin.etsySync.description')}
          </Typography>
        </Box>
        <Button variant="secondary" onClick={handleSync} disabled={isSyncing}>
          <Icon as={RefreshCw} spin={isSyncing} />
          {isSyncing
            ? t('admin.etsySync.syncing')
            : t('admin.etsySync.syncNow')}
        </Button>
      </Box>
    </Card>
  );
};

export default AdminEtsySyncPanel;
