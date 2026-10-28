import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../../i18n';
import AdminRegistrationsExportButton from '../AdminRegistrationsExportButton';
import ToastProvider from '../../../toast/ToastProvider';
import { downloadCsvFile } from '../../../../utils/registrationsCsv';
import { fetchMarketingRegistrations } from '../../../../services/registrationService';
import type { CatalogItem } from '../../../../types/catalog';
import type { WorkshopRegistration } from '../../../../types/registrations';

vi.mock('../../../../utils/registrationsCsv', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('../../../../utils/registrationsCsv')
  >();

  return { ...module, downloadCsvFile: vi.fn() };
});

vi.mock('../../../../services/registrationService', () => ({
  fetchMarketingRegistrations: vi.fn(),
}));

const workshop: CatalogItem = {
  id: 't1',
  title: 'Taller Creativo de Pintura',
  description: 'Sesión presencial',
  image: '/img/taller.jpg',
  category: 'talleres',
  status: 'disponible',
};

const registration = (
  overrides: Partial<WorkshopRegistration> = {}
): WorkshopRegistration => ({
  id: 'r1',
  product_id: 't1',
  name: 'Ana',
  email: 'ana@mail.com',
  status: 'pendiente',
  privacy_consent_at: '2026-10-20T10:00:00.000Z',
  marketing_consent: true,
  created_at: '2026-10-20T10:00:00.000Z',
  ...overrides,
});

const renderButton = () =>
  render(
    <ToastProvider>
      <AdminRegistrationsExportButton workshops={[workshop]} />
    </ToastProvider>
  );

const exportButton = () =>
  screen.getByRole('button', {
    name: i18n.t('admin.registrations.exportAria'),
  });

describe('AdminRegistrationsExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('descarga el CSV general con los contactos que devuelve la base de datos', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchMarketingRegistrations).mockResolvedValue([
      registration(),
      registration({
        id: 'r2',
        product_id: 't2',
        name: 'Luis',
        status: 'cancelado',
        created_at: '2026-10-21T10:00:00.000Z',
      }),
      registration({ id: 'r3', name: 'Sin avisos', marketing_consent: false }),
    ]);
    renderButton();

    await user.click(exportButton());

    expect(fetchMarketingRegistrations).toHaveBeenCalledTimes(1);
    expect(vi.mocked(downloadCsvFile)).toHaveBeenCalledTimes(1);

    const [nombre, csv] = vi.mocked(downloadCsvFile).mock.calls[0];

    expect(nombre).toMatch(/^avisos-talleres-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(csv).toContain('Luis;ana@mail.com;;2026-10-21;Cancelado');
    expect(csv).toContain('Ana;ana@mail.com;Taller Creativo de Pintura');
    expect(csv.trim().split('\r\n')).toHaveLength(3);
    expect(
      screen.getByText(i18n.t('admin.registrations.exportDone', { count: 2 }))
    ).toBeInTheDocument();
  });

  it('avisa cuando no hay contactos con consentimiento en la base de datos', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchMarketingRegistrations).mockResolvedValue([]);
    renderButton();

    await user.click(exportButton());

    expect(vi.mocked(downloadCsvFile)).not.toHaveBeenCalled();
    expect(
      screen.getByText(i18n.t('admin.registrations.exportEmpty'))
    ).toBeInTheDocument();
  });

  it('muestra un error si falla la consulta a la base de datos', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchMarketingRegistrations).mockRejectedValue(
      new Error('permission denied')
    );
    renderButton();

    await user.click(exportButton());

    expect(vi.mocked(downloadCsvFile)).not.toHaveBeenCalled();
    expect(
      screen.getByText(i18n.t('admin.registrations.exportError'))
    ).toBeInTheDocument();
  });
});
