import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

describe('NotFoundPage', () => {
  it('muestra el título y el enlace de vuelta al catálogo', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'Página no encontrada' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Volver al catálogo' })
    ).toHaveAttribute('href', '/es');
  });

  it('marca la página como noindex y actualiza el título', () => {
    renderPage();

    expect(
      document.head.querySelector('meta[name="robots"]')
    ).toHaveAttribute('content', 'noindex, nofollow');
    expect(document.title).toBe('Página no encontrada | Laurel en Lienzo');
  });

  it('restaura el estado de robots al desmontar', () => {
    const { unmount } = renderPage();
    const meta = document.head.querySelector('meta[name="robots"]');

    expect(meta).not.toBeNull();

    unmount();

    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
});
