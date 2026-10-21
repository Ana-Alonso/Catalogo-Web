import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
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

  it('actualiza el título del documento', () => {
    renderPage();

    expect(document.title).toBe('Página no encontrada | Laurel en Lienzo');
  });

  it('muestra la descripción del error', () => {
    renderPage();

    expect(
      screen.getByText('La página que buscas no existe o se ha movido.')
    ).toBeInTheDocument();
  });
});
