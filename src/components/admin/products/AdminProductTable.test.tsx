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
  blockedDeletionIds: new Set<string>(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  onSetVisibility: vi.fn(),
  isDeleting: false,
  isUpdatingVisibility: false,
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

  it('archiva un producto local poniendo isVisible a false', async () => {
    const user = userEvent.setup();
    const onSetVisibility = vi.fn();
    const local = { ...producto, source: 'local' as const, isVisible: true };

    renderTable({ ...buildProps(), products: [local], onSetVisibility });

    const archivar = screen.getAllByRole('button', {
      name: 'Archivar Ilustración en acuarela',
    });
    expect(archivar).toHaveLength(2);

    await user.click(archivar[0]);

    expect(onSetVisibility).toHaveBeenCalledWith('1', false);
  });

  it('vuelve a publicar un producto archivado', async () => {
    const user = userEvent.setup();
    const onSetVisibility = vi.fn();
    const local = { ...producto, source: 'local' as const, isVisible: false };

    renderTable({ ...buildProps(), products: [local], onSetVisibility });

    expect(screen.getAllByText('Oculto').length).toBeGreaterThan(0);

    const publicar = screen.getAllByRole('button', {
      name: 'Volver a publicar Ilustración en acuarela',
    });

    await user.click(publicar[0]);

    expect(onSetVisibility).toHaveBeenCalledWith('1', true);
  });

  it('no permite archivar productos de Etsy porque su visibilidad viene de Etsy', () => {
    renderTable({ ...buildProps(), products: [producto] });

    const etsy = screen.getAllByRole('button', {
      name: 'Ilustración en acuarela se oculta desde Etsy',
    });

    expect(etsy).toHaveLength(2);
    etsy.forEach((button) => expect(button).toBeDisabled());
  });

  it('deshabilita el borrado cuando hay contactos protegidos', () => {
    const local = { ...producto, source: 'local' as const };

    renderTable({
      ...buildProps(),
      products: [local],
      blockedDeletionIds: new Set(['1']),
    });

    const eliminar = screen.getAllByRole('button', {
      name: 'Ilustración en acuarela no se puede eliminar porque tiene contactos con consentimiento de avisos',
    });

    expect(eliminar).toHaveLength(2);
    eliminar.forEach((button) => expect(button).toBeDisabled());
  });
});
