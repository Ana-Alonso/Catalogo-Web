import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, LoaderCircle } from 'lucide-react';
import { Button, Icon } from '../../ui';
import { useToast } from '../../../hooks/useToast';
import { registrationStatusTranslationKeys } from '../../../i18n/labels';
import { fetchMarketingRegistrations } from '../../../services/registrationService';
import { logError } from '../../../utils/logger';
import {
  buildCsv,
  buildMarketingCsvRows,
  downloadCsvFile,
} from '../../../utils/registrationsCsv';
import type { CatalogItem } from '../../../types/catalog';

const EXPORT_FILENAME_PREFIX = 'avisos-talleres';

interface AdminRegistrationsExportButtonProps {
  workshops: CatalogItem[];
}

export const AdminRegistrationsExportButton: React.FC<
  AdminRegistrationsExportButtonProps
> = ({ workshops }) => {
  const { t } = useTranslation();
  const { success: notifySuccess, error: notifyError } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const workshopTitleById = useMemo(
    () =>
      Object.fromEntries(
        workshops.map((workshop) => [String(workshop.id), workshop.title])
      ),
    [workshops]
  );

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const registrations = await fetchMarketingRegistrations();
      const rows = buildMarketingCsvRows(
        registrations,
        workshopTitleById,
        (status) => t(registrationStatusTranslationKeys[status])
      );

      if (rows.length === 0) {
        notifyError(t('admin.registrations.exportEmpty'));
        return;
      }

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
    } catch (err) {
      logError('AdminRegistrationsExportButton.handleExport', err);
      notifyError(t('admin.registrations.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      aria-label={t('admin.registrations.exportAria')}
    >
      <Icon as={isExporting ? LoaderCircle : Download} size="sm" spin={isExporting} />
      {t('admin.registrations.export')}
    </Button>
  );
};

export default AdminRegistrationsExportButton;
