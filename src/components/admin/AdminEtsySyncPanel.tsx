import React, { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Card, Box } from '../ui';
import { theme } from '../../theme';
import { triggerEtsySync } from '../../services/etsySyncService';

interface AdminEtsySyncPanelProps {
  onSynced: () => Promise<void>;
}

interface SyncFeedback {
  type: 'success' | 'error';
  text: string;
}

export const AdminEtsySyncPanel: React.FC<AdminEtsySyncPanelProps> = ({ onSynced }) => {
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
        text: `Sincronización completada: ${result.total} productos (${result.created} nuevos, ${result.updated} actualizados, ${result.hidden} ocultos).`,
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al sincronizar con Etsy.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="p-6">
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Box>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            Sincronización con Etsy
          </h3>
          <p className={`${theme.colors.textMuted} text-sm`}>
            Los cambios en Etsy llegan automáticamente. Usa este botón para forzar una
            reconciliación completa.
          </p>
        </Box>
        <Button variant="secondary" onClick={handleSync} disabled={isSyncing}>
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
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
