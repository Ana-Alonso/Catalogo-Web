import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Presence } from '../ui';
import { ToastItem } from './ToastItem';
import type { ToastRecord } from '../../types/toast';

interface ToastViewportProps {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
}

export const ToastViewport: React.FC<ToastViewportProps> = ({ toasts, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Box
      as="section"
      aria-label={t('notifications.title')}
      className="fixed inset-x-0 bottom-0 z-[70] flex flex-col gap-3 p-4 sm:inset-x-auto sm:left-auto sm:right-6 sm:bottom-6 sm:w-96"
    >
      <Presence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </Presence>
    </Box>
  );
};

export default ToastViewport;
