import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminWorkshopsPanel } from '../AdminWorkshopsPanel';
import { ConfirmProvider } from '../../../confirm/ConfirmProvider';
import ToastProvider from '../../../toast/ToastProvider';
import type { CatalogItem } from '../../../../types/catalog';
import type { WorkshopRegistration } from '../../../../types/registrations';

const DAY_MS = 24 * 60 * 60 * 1000;
const futureDate = () => new Date(Date.now() + 30 * DAY_MS).toISOString();
const pastDate = () => new Date(Date.now() - 30 * DAY_MS).toISOString();

const workshop = (overrides: Partial<CatalogItem> = {}): CatalogItem => ({
  id: 'w-1',
  title: 'Taller de acuarela',
  description: 'Acuarela para principiantes',
  image: '/img/taller.jpg',
  category: 'talleres',
  status: 'disponible',
  isVisible: true,
  eventDate: futureDate(),
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
  workshops: [] as CatalogItem[],
  registrations: [] as WorkshopRegistration[],
  isLoading: false,
  error: null,
  isUpdatingVisibility: false,
  onRetry: vi.fn(),
  onEdit: vi.fn(),
  onSetVisibility: vi.fn(),
  onSetStatus: vi.fn().mockResolvedValue(true),
  onDeleteRegistration: vi.fn().mockResolvedValue(true),
});

const renderPanel = (props: Parameters<typeof AdminWorkshopsPanel>[0]) =>
  render(
    <ConfirmProvider>
      <ToastProvider>
        <AdminWorkshopsPanel {...props} />
      </ToastProvider>
    </ConfirmProvider>
  );

describe('AdminWorkshopsPanel', () => {
  it('muestra los talleres activos con sus contadores', () => {
    renderPanel({
      ...buildProps(),
      workshops: [
        workshop({ id: 'w-1', title: 'Taller de acuarela' }),
        workshop({ id: 'w-2', title: 'Taller de cerámica' }),
      ],
      registrations: [
        registration({ id: 'r-1', product_id: 'w-1' }),
        registration({ id: 'r-2', product_id: 'w-1', status: 'confirmado' }),
      ],
    });

    expect(screen.getByText('Taller de acuarela')).toBeInTheDocument();
    expect(screen.getByText('Taller de cerámica')).toBeInTheDocument();
    expect(screen.getByText('Talleres activos (2)')).toBeInTheDocument();
  });

  it('pliega las inscripciones cuando hay más de un taller activo', async () => {
    const user = userEvent.setup();
    renderPanel({
      ...buildProps(),
      workshops: [
        workshop({ id: 'w-1', title: 'Taller de acuarela' }),
        workshop({ id: 'w-2', title: 'Taller de cerámica' }),
      ],
      registrations: [registration({ product_id: 'w-1' })],
    });

    expect(screen.queryByText('Ana García')).not.toBeInTheDocument();

    const botones = screen.getAllByRole('button', {
      name: /Ver las inscripciones de/,
    });
    expect(botones).toHaveLength(2);

    await user.click(
      screen.getByRole('button', {
        name: 'Ver las inscripciones de Taller de acuarela',
      })
    );

    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('muestra siempre las inscripciones cuando solo hay un taller activo', () => {
    renderPanel({
      ...buildProps(),
      workshops: [workshop()],
      registrations: [registration()],
    });

    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Ver las inscripciones de Taller de acuarela',
      })
    ).not.toBeInTheDocument();
  });

  it('separa los talleres finalizados y muestra el motivo', () => {
    renderPanel({
      ...buildProps(),
      workshops: [
        workshop({ id: 'w-1', title: 'Taller de acuarela' }),
        workshop({
          id: 'w-2',
          title: 'Taller pasado',
          eventDate: pastDate(),
        }),
        workshop({ id: 'w-3', title: 'Taller vendido', status: 'vendido' }),
      ],
    });

    expect(screen.getByText('Talleres finalizados (2)')).toBeInTheDocument();
    expect(screen.getByText('Taller pasado')).toBeInTheDocument();
    expect(screen.getByText('Taller vendido')).toBeInTheDocument();
    expect(screen.getByText('Celebrado')).toBeInTheDocument();
    expect(screen.getAllByText('Vendido').length).toBeGreaterThan(0);
  });

  it('ignora los productos archivados del panel de talleres', () => {
    renderPanel({
      ...buildProps(),
      workshops: [
        workshop({ id: 'w-1', title: 'Taller de acuarela' }),
        workshop({ id: 'w-2', title: 'Taller archivado', isVisible: false }),
      ],
    });

    expect(screen.queryByText('Taller archivado')).not.toBeInTheDocument();
  });

  it('muestra el aviso de contactos con consentimiento', () => {
    renderPanel({
      ...buildProps(),
      workshops: [workshop()],
      registrations: [
        registration({ id: 'r-1' }),
        registration({ id: 'r-2', marketing_consent: true }),
      ],
    });

    expect(screen.getByText('1 con avisos')).toBeInTheDocument();
  });

  it('permite cambiar el estado de una inscripción finalizada', async () => {
    const user = userEvent.setup();
    const onSetStatus = vi.fn().mockResolvedValue(true);
    renderPanel({
      ...buildProps(),
      workshops: [workshop({ id: 'w-2', title: 'Taller pasado', eventDate: pastDate() })],
      registrations: [registration({ id: 'r-1', product_id: 'w-2' })],
      onSetStatus,
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Ver las inscripciones de Taller pasado',
      })
    );
    await user.click(
      screen.getByRole('button', {
        name: 'Confirmar inscripción de Ana García',
      })
    );

    expect(onSetStatus).toHaveBeenCalledWith('r-1', 'confirmado');
  });

  it('archiva un taller activo desde su tarjeta', async () => {
    const onSetVisibility = vi.fn();
    renderPanel({
      ...buildProps(),
      workshops: [workshop()],
      onSetVisibility,
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Archivar Taller de acuarela' })
    );

    expect(onSetVisibility).toHaveBeenCalledWith('w-1', false);
  });

  it('muestra el estado vacío y el error de carga', () => {
    const { rerender } = renderPanel(buildProps());

    expect(screen.getByText('No hay talleres activos.')).toBeInTheDocument();

    rerender(
      <ConfirmProvider>
        <ToastProvider>
          <AdminWorkshopsPanel
            {...buildProps()}
            error="No se pudo conectar"
          />
        </ToastProvider>
      </ConfirmProvider>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron cargar las inscripciones'
    );
  });
});
