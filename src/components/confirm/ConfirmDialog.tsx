import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '../ui';
import { Modal } from '../ui/Modal';
import type { ConfirmRequest } from '../../types/confirm';

interface ConfirmDialogProps {
  request: ConfirmRequest | null;
  onSettle: (isConfirmed: boolean) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ request, onSettle }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={request !== null}
      onClose={() => onSettle(false)}
      title={request?.title ?? t('common.confirmTitle')}
    >
      {request && (
        <Box display="flex" direction="column" gap="lg">
          <Typography variant="body" size="sm">
            {request.message}
          </Typography>
          <Box display="flex" justify="end" gap="sm" wrap>
            <Button variant="ghost" onClick={() => onSettle(false)}>
              {request.cancelLabel ?? t('common.cancel')}
            </Button>
            <Button
              variant={request.isDanger ? 'danger' : 'primary'}
              onClick={() => onSettle(true)}
            >
              {request.confirmLabel ??
                (request.isDanger ? t('common.delete') : t('common.save'))}
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ConfirmDialog;
