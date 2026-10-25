import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GallerySection } from '../GallerySection';
import type { GallerySectionProps } from '../GallerySection';

const buildProps = (
  overrides: Partial<GallerySectionProps> = {}
): GallerySectionProps => ({
  items: [],
  activeCategory: 'todas',
  onSelectCategory: vi.fn(),
  isLoading: false,
  error: null,
  onRetry: vi.fn(),
  ...overrides,
});

describe('GallerySection', () => {
  it('muestra esqueletos mientras carga', () => {
    const { container } = render(<GallerySection {...buildProps({ isLoading: true })} />);

    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Cargando catálogo…'
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('muestra el error y permite reintentar', async () => {
    const onRetry = vi.fn();
    render(
      <GallerySection
        {...buildProps({ error: 'Fallo de red', onRetry })}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudo cargar el catálogo'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('muestra el estado vacío cuando no hay piezas', () => {
    render(<GallerySection {...buildProps()} />);

    expect(
      screen.getByText('No hay piezas disponibles en esta categoría por el momento.')
    ).toBeInTheDocument();
  });

  it('avisa de un fallo de plazas sin ocultar el catálogo', async () => {
    const onRetrySpots = vi.fn();
    render(
      <GallerySection
        {...buildProps({
          items: [
            {
              id: '1',
              title: 'Obra',
              description: 'Descripción',
              image: '/obra.jpg',
              category: 'ilustraciones',
              status: 'disponible',
            },
          ],
          spotsError: 'No se pudieron actualizar las plazas.',
          onRetrySpots,
        })}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron actualizar las plazas.'
    );
    expect(screen.getByText('Obra')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetrySpots).toHaveBeenCalledTimes(1);
  });
});
