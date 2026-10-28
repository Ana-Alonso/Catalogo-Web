import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmProvider } from '../../../confirm/ConfirmProvider';
import { AdminProductTable } from '../AdminProductTable';
import type { CatalogItem } from '../../../../types/catalog';

const product = (index: number): CatalogItem => ({
  id: `p-${index}`,
  title: `Producto ${index}`,
  description: 'Descripción',
  image: '/img/producto.jpg',
  category: 'ilustraciones',
  status: 'disponible',
  priceCents: 1500,
  currency: 'EUR',
  isVisible: true,
});

const buildProps = (products: CatalogItem[]) => ({
  products,
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

const renderTable = (products: CatalogItem[]) =>
  render(
    <ConfirmProvider>
      <AdminProductTable {...buildProps(products)} />
    </ConfirmProvider>
  );

describe('AdminProductTable', () => {
  it('no pagina cuando todos los productos caben en una página', () => {
    renderTable(Array.from({ length: 10 }, (_, index) => product(index + 1)));

    expect(
      screen.queryByRole('navigation', { name: 'Paginación del catálogo' })
    ).not.toBeInTheDocument();
  });

  it('muestra solo los primeros diez productos y permite avanzar', async () => {
    const user = userEvent.setup();
    renderTable(Array.from({ length: 12 }, (_, index) => product(index + 1)));

    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    expect(screen.getAllByText('Producto 1').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Producto 11')).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    expect(screen.queryAllByText('Producto 1')).toHaveLength(0);
    expect(screen.getAllByText('Producto 11').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: 'Siguiente' })
    ).toBeDisabled();
  });

  it('permite volver a la página anterior', async () => {
    const user = userEvent.setup();
    renderTable(Array.from({ length: 12 }, (_, index) => product(index + 1)));

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Anterior' }));

    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  });

  it('ajusta la página si se eliminan productos de la última página', async () => {
    const user = userEvent.setup();
    const { rerender } = renderTable(
      Array.from({ length: 11 }, (_, index) => product(index + 1))
    );

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();

    rerender(
      <ConfirmProvider>
        <AdminProductTable
          {...buildProps(
            Array.from({ length: 10 }, (_, index) => product(index + 1))
          )}
        />
      </ConfirmProvider>
    );

    expect(screen.queryByText(/Página 2 de/)).not.toBeInTheDocument();
    expect(screen.getAllByText('Producto 1').length).toBeGreaterThan(0);
  });
});
