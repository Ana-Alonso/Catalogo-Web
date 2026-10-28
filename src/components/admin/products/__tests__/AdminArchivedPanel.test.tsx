import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminArchivedPanel } from '../AdminArchivedPanel';
import { ConfirmProvider } from '../../../confirm/ConfirmProvider';
import ToastProvider from '../../../toast/ToastProvider';
import type { CatalogItem } from '../../../../types/catalog';
import type { WorkshopRegistration } from '../../../../types/registrations';

const archivedProduct = (
  overrides: Partial<CatalogItem> = {}
): CatalogItem => ({
  id: 'p-1',
  title: 'Ilustración archivada',
  description: 'Obra oculta',
  image: '/img/obra.jpg',
  category: 'ilustraciones',
  source: 'local',
  status: 'disponible',
  isVisible: false,
  created_at: '2026-09-01T10:00:00.000Z',
  ...overrides,
});

const archivedWorkshop = (overrides: Partial<CatalogItem> = {}): CatalogItem =>
  archivedProduct({
    id: 'w-1',
    title: 'Taller archivado',
    category: 'talleres',
    eventDate: '2026-10-01T18:00:00.000Z',
    ...overrides,
  });

const registration = (
  overrides: Partial<WorkshopRegistration> = {}
): WorkshopRegistration => ({
  id: 'r-1',
  product_id: 'w-1',
  name: 'Ana García',
  email: 'ana@example.com',
  status: 'pendiente',
  privacy_consent_at: '2026-09-01T10:00:00.000Z',
  marketing_consent: false,
  created_at: '2026-09-01T10:00:00.000Z',
  ...overrides,
});

const buildProps = () => ({
  products: [] as CatalogItem[],
  registrations: [] as WorkshopRegistration[],
  isLoading: false,
  error: null,
  isDeleting: false,
  isUpdatingVisibility: false,
  protectedProductIds: new Set<string>(),
  onRetry: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  onSetVisibility: vi.fn(),
  onSetStatus: vi.fn().mockResolvedValue(true),
  onWithdrawMarketingConsent: vi.fn().mockResolvedValue(true),
  onDeleteRegistration: vi.fn().mockResolvedValue(true),
});

const renderPanel = (props: Parameters<typeof AdminArchivedPanel>[0]) =>
  render(
    <ConfirmProvider>
      <ToastProvider>
        <AdminArchivedPanel {...props} />
      </ToastProvider>
    </ConfirmProvider>
  );

describe('AdminArchivedPanel', () => {
  it('muestra el estado vacío sin archivados', () => {
    renderPanel(buildProps());

    expect(
      screen.getByText('No hay productos archivados.')
    ).toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', async () => {
    const onRetry = vi.fn();
    renderPanel({ ...buildProps(), error: 'Fallo de red', onRetry });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron cargar los productos archivados'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('restaura un producto archivado', async () => {
    const onSetVisibility = vi.fn();
    renderPanel({
      ...buildProps(),
      products: [archivedProduct()],
      onSetVisibility,
    });

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Volver a publicar Ilustración archivada',
      })
    );

    expect(onSetVisibility).toHaveBeenCalledWith('p-1', true);
  });

  it('elimina definitivamente tras confirmar', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderPanel({ ...buildProps(), products: [archivedProduct()], onDelete });

    await user.click(
      screen.getByRole('button', { name: 'Eliminar Ilustración archivada' })
    );
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(onDelete).toHaveBeenCalledWith('p-1');
  });

  it('no permite borrar un producto con contactos protegidos', () => {
    renderPanel({
      ...buildProps(),
      products: [archivedWorkshop()],
      protectedProductIds: new Set(['w-1']),
    });

    const eliminar = screen.getByRole('button', {
      name: 'Taller archivado no se puede eliminar porque tiene contactos con consentimiento de avisos',
    });

    expect(eliminar).toBeDisabled();
  });

  it('deshabilita borrar y restaurar en productos de Etsy', () => {
    renderPanel({
      ...buildProps(),
      products: [archivedProduct({ source: 'etsy', title: 'Obra de Etsy' })],
    });

    expect(
      screen.getByRole('button', { name: 'Obra de Etsy se oculta desde Etsy' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: 'Obra de Etsy se elimina desde Etsy',
      })
    ).toBeDisabled();
  });

  it('muestra las inscripciones de un taller archivado y deshabilita las protegidas', async () => {
    const user = userEvent.setup();
    renderPanel({
      ...buildProps(),
      products: [archivedWorkshop()],
      registrations: [
        registration({ id: 'r-1', name: 'Ana García' }),
        registration({
          id: 'r-2',
          name: 'Luis Pérez',
          marketing_consent: true,
        }),
      ],
    });

    expect(screen.queryByText('Ana García')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'Ver las inscripciones de Taller archivado',
      })
    );

    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Luis Pérez')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Los datos de Luis Pérez están protegidos por consentimiento de avisos',
      })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Eliminar inscripción de Ana García' })
    ).toBeEnabled();
  });

  it('muestra la fecha de creación o un texto alternativo', () => {
    renderPanel({
      ...buildProps(),
      products: [
        archivedProduct({ id: 'p-1' }),
        archivedProduct({ id: 'p-2', title: 'Sin fecha', created_at: undefined }),
      ],
    });

    expect(screen.getAllByText(/Creado el/)).toHaveLength(2);
    expect(screen.getByText(/fecha desconocida/)).toBeInTheDocument();
  });
});
