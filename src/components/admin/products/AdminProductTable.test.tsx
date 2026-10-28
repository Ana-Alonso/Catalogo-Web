import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminProductTable } from './AdminProductTable';
import { ConfirmProvider } from '../../confirm/ConfirmProvider';
import type { CatalogItem } from '../../../types/catalog';

const renderTable = (props: Parameters<typeof AdminProductTable>[0]) =>
  render(
    <ConfirmProvider>
      <AdminProductTable {...props} />
    </ConfirmProvider>
  );

const buildProps = () => ({
  products: [],
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  isDeleting: false,
  isLoading: false,
  error: null,
  onRetry: vi.fn(),
});

const producto: CatalogItem = {
  id: '1',
  title: 'Ilustración en acuarela',
  description: 'Pintura de un paisaje',
  image: '/img/obra.jpg',
  category: 'ilustraciones',
  source: 'etsy',
  priceCents: 10000,
  currency: 'EUR',
  etsyLink: 'https://www.etsy.com/listing/1',
  isVisible: true,
  status: 'disponible',
};

describe('AdminProductTable', () => {
  it('muestra esqueletos mientras carga', () => {
    const { container } = render(
      <AdminProductTable {...buildProps()} isLoading />
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('muestra el error y permite reintentar', async () => {
    const onRetry = vi.fn();
    render(
      <AdminProductTable
        {...buildProps()}
        error="No se pudo conectar"
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron cargar los productos'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('muestra el estado vacío sin error', () => {
    render(<AdminProductTable {...buildProps()} />);

    expect(
      screen.getByText('No hay productos registrados en el catálogo.')
    ).toBeInTheDocument();
  });

  it('renderiza tabla y tarjeta con los mismos nombres accesibles', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const { container } = renderTable({
      ...buildProps(),
      products: [producto],
      onEdit,
    });

    const tabla = screen.getByRole('table');
    const tarjeta = container.querySelector('article');

    expect(tarjeta).not.toBeNull();
    expect(within(tabla).getAllByText('Ilustración en acuarela')).toHaveLength(1);
    expect(within(tarjeta as HTMLElement).getAllByText('Ilustración en acuarela')).toHaveLength(1);

    const editar = screen.getAllByRole('button', {
      name: 'Modificar Ilustración en acuarela',
    });
    expect(editar).toHaveLength(2);

    await user.click(within(tarjeta as HTMLElement).getByRole('button', {
      name: 'Modificar Ilustración en acuarela',
    }));

    expect(onEdit).toHaveBeenCalledWith(producto);
  });
});
