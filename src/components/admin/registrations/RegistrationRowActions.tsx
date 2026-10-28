import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Trash2, X } from 'lucide-react';
import { Button, Icon } from '../../ui';
import { useConfirm } from '../../../hooks/useConfirm';
import { useToast } from '../../../hooks/useToast';
import type { RegistrationStatus, WorkshopRegistration } from '../../../types/registrations';

interface RegistrationRowActionsProps {
  registration: WorkshopRegistration;
  onSetStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const RegistrationRowActions: React.FC<RegistrationRowActionsProps> = ({
  registration,
  onSetStatus,
  onDelete,
}) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { success, error: notifyError } = useToast();

  const handleSetStatus = async (status: RegistrationStatus): Promise<void> => {
    const isDone = await onSetStatus(registration.id, status);

    if (isDone) {
      success(t('admin.registrations.statusUpdated', { name: registration.name }));
      return;
    }

    notifyError(t('admin.errors.updateRegistration'));
  };

  const handleDelete = async (): Promise<void> => {
    const isConfirmed = await confirm({
      message: t('admin.registrations.deleteConfirm', { name: registration.name }),
      confirmLabel: t('common.delete'),
      isDanger: true,
    });

    if (!isConfirmed) {
      return;
    }

    const isDone = await onDelete(registration.id);

    if (isDone) {
      success(t('admin.registrations.deleted', { name: registration.name }));
      return;
    }

    notifyError(t('admin.errors.deleteRegistration'));
  };

  return (
    <>
      {registration.status !== 'confirmado' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void handleSetStatus('confirmado')}
          aria-label={t('admin.registrations.confirmAria', { name: registration.name })}
        >
          <Icon as={Check} tone="success" />
        </Button>
      )}
      {registration.status !== 'cancelado' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void handleSetStatus('cancelado')}
          aria-label={t('admin.registrations.cancelAria', { name: registration.name })}
        >
          <Icon as={X} tone="warning" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => void handleDelete()}
        aria-label={t('admin.registrations.deleteAria', { name: registration.name })}
      >
        <Icon as={Trash2} tone="danger" />
      </Button>
    </>
  );
};

export default RegistrationRowActions;
