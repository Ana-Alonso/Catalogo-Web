import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminProductTable } from './AdminProductTable';

const buildProps = () => ({
  products: [],
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  isDeleting: false,
  isLoading: false,
  error: null,
  onRetry: vi.fn(),
});

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
});
