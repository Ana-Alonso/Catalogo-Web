import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Card, Box, Typography } from '../ui';
import {
  EtsySyncError,
  triggerEtsySync,
  type EtsySyncErrorCode,
} from '../../services/etsySyncService';

interface AdminEtsySyncPanelProps {
  onSynced: () => Promise<void>;
}

interface SyncFeedback {
  type: 'success' | 'error';
  text: string;
}

const syncErrorKeys = {
  notConfigured: 'admin.etsySync.errors.notConfigured',
  unauthorized: 'admin.etsySync.errors.unauthorized',
  unexpectedResponse: 'admin.etsySync.errors.unexpectedResponse',
  unknown: 'admin.etsySync.errors.unknown',
} as const satisfies Record<EtsySyncErrorCode, string>;

export const AdminEtsySyncPanel: React.FC<AdminEtsySyncPanelProps> = ({ onSynced }) => {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState<SyncFeedback | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setFeedback(null);

    try {
      const result = await triggerEtsySync();
      await onSynced();
      setFeedback({
        type: 'success',
        text: t('admin.etsySync.success', {
          total: result.total,
          created: result.created,
          updated: result.updated,
          hidden: result.hidden,
        }),
      });
    } catch (error) {
      const text =
        error instanceof EtsySyncError
          ? t(syncErrorKeys[error.code])
          : error instanceof Error
            ? error.message
            : t('admin.etsySync.error');
      setFeedback({ type: 'error', text });
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
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing
            ? t('admin.etsySync.syncing')
            : t('admin.etsySync.syncNow')}
        </Button>
      </Box>

      {feedback && (
        <Box
          marginTop="md"
          padding="tight"
          rounded="lg"
          border
          display="flex"
          align="center"
          gap="sm"
          background={feedback.type === 'success' ? 'successSoft' : 'dangerSoft'}
          borderTone={feedback.type === 'success' ? 'success' : 'danger'}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          )}
          <Typography
            variant="body"
            size="sm"
            tone={feedback.type === 'success' ? 'successSoft' : 'dangerSoft'}
          >
            {feedback.text}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default AdminEtsySyncPanel;
