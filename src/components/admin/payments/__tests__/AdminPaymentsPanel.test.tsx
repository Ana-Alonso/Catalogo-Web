import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import { AdminPaymentsPanel } from '../AdminPaymentsPanel';
import type { CatalogItem } from '../../../../types/catalog';
import type { WorkshopRegistration } from '../../../../types/registrations';

const DAY_MS = 24 * 60 * 60 * 1000;

const taller: CatalogItem = {
  id: 't1',
  title: 'Taller de acuarela',
  description: 'Presencial',
  image: '/img/taller.jpg',
  category: 'talleres',
  status: 'disponible',
  eventDate: new Date(Date.now() + 20 * DAY_MS).toISOString(),
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
  name: 'Ana García',
  email: 'ana@example.com',
  status: 'confirmado',
  privacy_consent_at: '2026-11-01T10:00:00.000Z',
  marketing_consent: false,
  quantity: 1,
  amount: null,
  paid: false,
  paid_at: null,
  fulfilled_at: null,
  created_at: '2026-11-01T10:00:00.000Z',
  ...overrides,
});

const buildProps = () => ({
  workshops: [taller, especial],
  registrations: [
    registration(),
    registration({
      id: 'r2',
      name: 'Luis Pérez',
      email: 'luis@example.com',
      status: 'cancelado',
    }),
    registration({
      id: 'r3',
      product_id: 'e1',
      name: 'Marta Ruiz',
      email: 'marta@example.com',
      quantity: 2,
      amount: 42,
      paid: true,
      paid_at: '2026-11-02T10:00:00.000Z',
      created_at: '2026-11-02T10:00:00.000Z',
    }),
  ],
  isLoading: false,
  error: null,
  onRetry: vi.fn(),
  onSetPayment: vi.fn().mockResolvedValue(true),
});

const rowOf = (name: string): HTMLElement =>
  screen.getByText(name).closest('tr') as HTMLElement;

describe('AdminPaymentsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista las reservas sin cobrar de ambas categorías y oculta las canceladas', () => {
    render(<AdminPaymentsPanel {...buildProps()} />);

    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Marta Ruiz')).toBeInTheDocument();
    expect(screen.queryByText('Luis Pérez')).not.toBeInTheDocument();
    expect(screen.getByText('Taller de acuarela')).toBeInTheDocument();
    expect(screen.getByText('Edición de temporada')).toBeInTheDocument();
  });

  it('marca pagado enviando solo el flag de pago', async () => {
    const user = userEvent.setup();
    const props = buildProps();
    render(<AdminPaymentsPanel {...props} />);

    await user.click(
      within(rowOf('Ana García')).getByRole('button', { name: 'Pagado' })
    );

    expect(props.onSetPayment).toHaveBeenCalledWith('r1', { paid: true });
  });

  it('usa entregado para productos y asistido para talleres', async () => {
    const user = userEvent.setup();
    const props = buildProps();
    render(<AdminPaymentsPanel {...props} />);

    await user.click(
      within(rowOf('Marta Ruiz')).getByRole('button', { name: 'Entregado' })
    );
    expect(props.onSetPayment).toHaveBeenCalledWith('r3', { fulfilled: true });

    await user.click(
      within(rowOf('Ana García')).getByRole('button', { name: 'Asistido' })
    );
    expect(props.onSetPayment).toHaveBeenCalledWith('r1', { fulfilled: true });

    expect(
      within(rowOf('Marta Ruiz')).getByRole('button', { name: 'Entregado' })
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('envía el importe libre al salir del campo', () => {
    const props = buildProps();
    render(<AdminPaymentsPanel {...props} />);

    const importe = screen.getByLabelText('Importe cobrado a Ana García, en euros');
    fireEvent.change(importe, { target: { value: '12,50' } });
    fireEvent.blur(importe);

    expect(props.onSetPayment).toHaveBeenCalledWith('r1', { amount: 12.5 });
  });

  it('no llama al servicio si el importe no cambia', () => {
    const props = buildProps();
    render(<AdminPaymentsPanel {...props} />);

    const importe = screen.getByLabelText('Importe cobrado a Marta Ruiz, en euros');
    fireEvent.blur(importe);

    expect(props.onSetPayment).not.toHaveBeenCalled();
  });

  it('rechaza en el campo importes por encima del techo de la base de datos', () => {
    const props = buildProps();
    render(<AdminPaymentsPanel {...props} />);

    const importe = screen.getByLabelText(
      'Importe cobrado a Ana García, en euros'
    ) as HTMLInputElement;
    fireEvent.change(importe, { target: { value: '100000' } });
    fireEvent.blur(importe);

    expect(props.onSetPayment).not.toHaveBeenCalled();
    expect(importe.value).toBe('');
  });

  it('filtra por estado de cobro', async () => {
    const user = userEvent.setup();
    render(<AdminPaymentsPanel {...buildProps()} />);

    await user.click(screen.getByRole('button', { name: 'Sin cobrar' }));
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.queryByText('Marta Ruiz')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Cobrado sin entregar' })
    );
    expect(screen.queryByText('Ana García')).not.toBeInTheDocument();
    expect(screen.getByText('Marta Ruiz')).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay reservas que cobrar', () => {
    render(
      <AdminPaymentsPanel {...buildProps()} registrations={[]} />
    );

    expect(
      screen.getByText('Todavía no hay reservas que cobrar.')
    ).toBeInTheDocument();
  });

  it('muestra el error con reintento', () => {
    const props = { ...buildProps(), error: 'Sin conexión' };
    render(<AdminPaymentsPanel {...props} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(props.onRetry).not.toHaveBeenCalled();
  });
});
