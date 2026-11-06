import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, LoaderCircle } from 'lucide-react';
import { Box, Button, Icon } from '../../ui';
import { useToast } from '../../../hooks/useToast';
import { useNow } from '../../../hooks/useNow';
import { registrationStatusTranslationKeys } from '../../../i18n/labels';
import { getWorkshopFinishedReason } from '../../../utils/workshopPhase';
import { fetchMarketingRegistrations } from '../../../services/registrationService';
import { logError } from '../../../utils/logger';
import {
  buildCsv,
  buildMarketingContacts,
  buildRegistrationRows,
  downloadCsvFile,
} from '../../../utils/registrationsCsv';
import type { CatalogItem } from '../../../types/catalog';
import type { WorkshopRegistration } from '../../../types/registrations';

const NOVEDADES_FILENAME_PREFIX = 'avisos-novedades';
const TALLERES_FILENAME_PREFIX = 'inscripciones-talleres';
const PRODUCTOS_FILENAME_PREFIX = 'reservas-productos';

interface AdminRegistrationsExportButtonProps {
  workshops: CatalogItem[];
  registrations: WorkshopRegistration[];
}

export const AdminRegistrationsExportButton: React.FC<
  AdminRegistrationsExportButtonProps
> = ({ workshops, registrations }) => {
  const { t } = useTranslation();
  const { success: notifySuccess, error: notifyError } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const productTitleById = useMemo(
    () =>
      Object.fromEntries(
        workshops.map((workshop) => [String(workshop.id), workshop.title])
      ),
    [workshops]
  );

  const nowMs = useNow();

  // Los CSV operativos solo cubren reservas que quedan por gestionar:
  // producto activo (sin celebrar, cancelar, vender ni archivar).
  const idsByCategory = useMemo(
    () =>
      workshops
        .filter((workshop) => getWorkshopFinishedReason(workshop, nowMs) === null)
        .reduce<Record<string, Set<string>>>((accumulated, workshop) => {
          const set = accumulated[workshop.category] ?? new Set<string>();
          set.add(String(workshop.id));
          accumulated[workshop.category] = set;
          return accumulated;
        }, {}),
    [workshops, nowMs]
  );

  const today = () => new Date().toISOString().slice(0, 10);
  const translateStatus = (status: WorkshopRegistration['status']) =>
    t(registrationStatusTranslationKeys[status]);

  const handleExportNovedades = async () => {
    setIsExporting(true);

    try {
      const marketingRegistrations = await fetchMarketingRegistrations();
      const contacts = buildMarketingContacts(marketingRegistrations);

      if (contacts.length === 0) {
        notifyError(t('admin.registrations.exportEmpty'));
        return;
      }

      const headers = [
        t('admin.registrations.csv.name'),
        t('admin.registrations.csv.email'),
        t('admin.registrations.csv.date'),
      ];

      downloadCsvFile(
        `${NOVEDADES_FILENAME_PREFIX}-${today()}.csv`,
        buildCsv(
          headers,
          contacts.map((contact) => [contact.name, contact.email, contact.date])
        )
      );
      notifySuccess(t('admin.registrations.exportDone', { count: contacts.length }));
    } catch (err) {
      logError('AdminRegistrationsExportButton.handleExportNovedades', err);
      notifyError(t('admin.registrations.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportList = (
    category: 'talleres' | 'especiales',
    emptyKey:
      | 'admin.registrations.exportEmptyWorkshops'
      | 'admin.registrations.exportEmptySpecials',
    filenamePrefix: string
  ) => {
    const withQuantity = category === 'especiales';
    const rows = buildRegistrationRows(
      registrations,
      idsByCategory[category] ?? new Set<string>(),
      productTitleById,
      translateStatus,
      { withQuantity }
    );

    if (rows.length === 0) {
      notifyError(t(emptyKey));
      return;
    }

    const headers = [
      t('admin.registrations.csv.name'),
      t('admin.registrations.csv.email'),
      withQuantity
        ? t('admin.registrations.csv.product')
        : t('admin.registrations.csv.workshop'),
      t('admin.registrations.csv.date'),
      t('admin.registrations.csv.status'),
      ...(withQuantity ? [t('admin.registrations.csv.quantity')] : []),
    ];

    downloadCsvFile(`${filenamePrefix}-${today()}.csv`, buildCsv(headers, rows));
    notifySuccess(t('admin.registrations.exportDone', { count: rows.length }));
  };

  return (
    <Box
      display="flex"
      wrap
      align="center"
      gap="xs"
      role="group"
      aria-label={t('admin.registrations.exportGroupLabel')}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportNovedades}
        disabled={isExporting}
        aria-label={t('admin.registrations.exportNovedadesAria')}
      >
        <Icon as={isExporting ? LoaderCircle : Download} size="sm" spin={isExporting} />
        {t('admin.registrations.exportNovedades')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleExportList(
            'talleres',
            'admin.registrations.exportEmptyWorkshops',
            TALLERES_FILENAME_PREFIX
          )
        }
        aria-label={t('admin.registrations.exportWorkshopsAria')}
      >
        <Icon as={Download} size="sm" />
        {t('admin.registrations.exportWorkshops')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleExportList(
            'especiales',
            'admin.registrations.exportEmptySpecials',
            PRODUCTOS_FILENAME_PREFIX
          )
        }
        aria-label={t('admin.registrations.exportProductsAria')}
      >
        <Icon as={Download} size="sm" />
        {t('admin.registrations.exportProducts')}
      </Button>
    </Box>
  );
};

export default AdminRegistrationsExportButton;
