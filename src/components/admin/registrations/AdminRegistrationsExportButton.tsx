import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button, Icon } from '../../ui';
import { useToast } from '../../../hooks/useToast';
import { registrationStatusTranslationKeys } from '../../../i18n/labels';
import {
  buildCsv,
  buildMarketingCsvRows,
  downloadCsvFile,
} from '../../../utils/registrationsCsv';
import type { CatalogItem } from '../../../types/catalog';
import type { WorkshopRegistration } from '../../../types/registrations';

const EXPORT_FILENAME_PREFIX = 'avisos-talleres';

interface AdminRegistrationsExportButtonProps {
  registrations: WorkshopRegistration[];
  workshops: CatalogItem[];
}

export const AdminRegistrationsExportButton: React.FC<
  AdminRegistrationsExportButtonProps
> = ({ registrations, workshops }) => {
  const { t } = useTranslation();
  const { success: notifySuccess } = useToast();

  const workshopTitleById = useMemo(
    () =>
      Object.fromEntries(
        workshops.map((workshop) => [String(workshop.id), workshop.title])
      ),
    [workshops]
  );

  const rows = useMemo(
    () =>
      buildMarketingCsvRows(
        registrations,
        workshopTitleById,
        (status) => t(registrationStatusTranslationKeys[status])
      ),
    [registrations, workshopTitleById, t]
  );

  const handleExport = () => {
    const headers = [
      t('admin.registrations.csv.name'),
      t('admin.registrations.csv.email'),
      t('admin.registrations.csv.workshop'),
      t('admin.registrations.csv.date'),
      t('admin.registrations.csv.status'),
    ];
    const date = new Date().toISOString().slice(0, 10);

    downloadCsvFile(
      `${EXPORT_FILENAME_PREFIX}-${date}.csv`,
      buildCsv(headers, rows)
    );
    notifySuccess(t('admin.registrations.exportDone', { count: rows.length }));
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={rows.length === 0}
      aria-label={t('admin.registrations.exportAria')}
      title={
        rows.length === 0
          ? t('admin.registrations.exportDisabledHint')
          : undefined
      }
    >
      <Icon as={Download} size="sm" />
      {t('admin.registrations.export')}
    </Button>
  );
};

export default AdminRegistrationsExportButton;
