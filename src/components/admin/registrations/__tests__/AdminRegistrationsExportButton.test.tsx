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

const taller: CatalogItem = {
  id: 't1',
  title: 'Taller Creativo de Pintura',
  description: 'Sesión presencial',
  image: '/img/taller.jpg',
  category: 'talleres',
  status: 'disponible',
};

const especial: CatalogItem = {
  id: 'e1',
  title: 'Edición de temporada',
  description: 'Tirada limitada',
  image: '/img/especial.jpg',
  category: 'especiales',
  status: 'disponible',
  cupo: 6,
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
  quantity: 1,
  created_at: '2026-10-20T10:00:00.000Z',
  ...overrides,
});

const renderButton = (
  workshops: CatalogItem[] = [taller, especial],
  registrations: WorkshopRegistration[] = []
) =>
  render(
    <ToastProvider>
      <AdminRegistrationsExportButton
        workshops={workshops}
        registrations={registrations}
      />
    </ToastProvider>
  );

const novedadesButton = () =>
  screen.getByRole('button', {
    name: i18n.t('admin.registrations.exportNovedadesAria'),
  });

const talleresButton = () =>
  screen.getByRole('button', {
    name: i18n.t('admin.registrations.exportWorkshopsAria'),
  });

const productosButton = () =>
  screen.getByRole('button', {
    name: i18n.t('admin.registrations.exportProductsAria'),
  });

describe('AdminRegistrationsExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('descarga la lista de novedades sin duplicar personas ni mezclar productos', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchMarketingRegistrations).mockResolvedValue([
      registration({ id: 'r1' }),
      registration({
        id: 'r2',
        product_id: 'e1',
        name: 'Ana García',
        email: 'ANA@mail.com',
        quantity: 2,
        created_at: '2026-10-22T10:00:00.000Z',
      }),
      registration({
        id: 'r3',
        name: 'Luis',
        email: 'luis@mail.com',
        status: 'cancelado',
        created_at: '2026-10-21T10:00:00.000Z',
      }),
      registration({ id: 'r4', name: 'Sin avisos', marketing_consent: false }),
    ]);
    renderButton();

    await user.click(novedadesButton());

    expect(fetchMarketingRegistrations).toHaveBeenCalledTimes(1);
    expect(vi.mocked(downloadCsvFile)).toHaveBeenCalledTimes(1);

    const [nombre, csv] = vi.mocked(downloadCsvFile).mock.calls[0];

    expect(nombre).toMatch(/^avisos-novedades-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(csv).toContain('Nombre;Email;Fecha');
    expect(csv).toContain('Ana García;ANA@mail.com;2026-10-22');
    expect(csv).toContain('Luis;luis@mail.com;2026-10-21');
    expect(csv.trim().split('\r\n')).toHaveLength(3);
    expect(
      screen.getByText(i18n.t('admin.registrations.exportDone', { count: 2 }))
    ).toBeInTheDocument();
  });

  it('exporta los talleres sin la columna de unidades', async () => {
    const user = userEvent.setup();
    renderButton([taller, especial], [
      registration(),
      registration({ id: 'r2', product_id: 'e1', quantity: 3 }),
    ]);

    await user.click(talleresButton());

    const [nombre, csv] = vi.mocked(downloadCsvFile).mock.calls[0];

    expect(nombre).toMatch(/^inscripciones-talleres-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(csv).toContain(
      'Ana;ana@mail.com;Taller Creativo de Pintura;2026-10-20;Pendiente'
    );
    expect(csv).not.toContain('Edición de temporada');
    expect(csv).not.toContain('Unidades');
  });

  it('exporta las reservas de producto con las unidades pedidas', async () => {
    const user = userEvent.setup();
    renderButton([taller, especial], [
      registration(),
      registration({ id: 'r2', product_id: 'e1', name: 'Luis', email: 'luis@mail.com', quantity: 3 }),
    ]);

    await user.click(productosButton());

    const [nombre, csv] = vi.mocked(downloadCsvFile).mock.calls[0];

    expect(nombre).toMatch(/^reservas-productos-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(csv).toContain('Nombre;Email;Producto;Fecha;Estado;Unidades');
    expect(csv).toContain('Luis;luis@mail.com;Edición de temporada;2026-10-20;Pendiente;3');
    expect(csv).not.toContain('Taller Creativo de Pintura');
  });

  it('avisa cuando una lista de gestión está vacía', async () => {
    const user = userEvent.setup();
    renderButton([taller, especial], [
      registration({ id: 'r2', product_id: 'e1' }),
    ]);

    await user.click(talleresButton());

    expect(vi.mocked(downloadCsvFile)).not.toHaveBeenCalled();
    expect(
      screen.getByText(i18n.t('admin.registrations.exportEmptyWorkshops'))
    ).toBeInTheDocument();
  });

  it('avisa cuando no hay contactos con consentimiento en la base de datos', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchMarketingRegistrations).mockResolvedValue([]);
    renderButton();

    await user.click(novedadesButton());

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

    await user.click(novedadesButton());

    expect(vi.mocked(downloadCsvFile)).not.toHaveBeenCalled();
    expect(
      screen.getByText(i18n.t('admin.registrations.exportError'))
    ).toBeInTheDocument();
  });
});
