import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Card, Box } from '../ui';
import { theme } from '../../theme';
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
    <Card className="p-6">
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Box>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            {t('admin.etsySync.title')}
          </h3>
          <p className={`${theme.colors.textMuted} text-sm`}>
            {t('admin.etsySync.description')}
          </p>
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
          className={`mt-4 p-3 rounded-lg border flex items-center gap-2 text-sm ${
            feedback.type === 'success'
              ? 'bg-green-950/40 border-green-800 text-green-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          )}
          <span>{feedback.text}</span>
        </Box>
      )}
    </Card>
  );
};

export default AdminEtsySyncPanel;
