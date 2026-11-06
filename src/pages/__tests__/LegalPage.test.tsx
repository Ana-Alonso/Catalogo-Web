import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import LegalPage from '../LegalPage';

const renderPage = (kind: 'privacy' | 'cookies') =>
  render(
    <MemoryRouter
      initialEntries={[`/es/${kind === 'privacy' ? 'privacidad' : 'cookies'}`]}
    >
      <LegalPage kind={kind} />
    </MemoryRouter>
  );

describe('LegalPage', () => {
  it('mantiene el encabezado con la marca enlazada al inicio y el selector de idioma', () => {
    renderPage('privacy');

    expect(
      screen.getByRole('link', { name: 'Logo Laurel en Lienzo' })
    ).toHaveAttribute('href', '/es');
    expect(
      screen.getByRole('link', { name: 'Cambiar a inglés' })
    ).toHaveAttribute('href', '/en/privacidad');
    expect(
      screen.getByRole('link', { name: 'Cambiar a español' })
    ).toHaveAttribute('hreflang', 'es');
  });

  it('muestra el título, la fecha de actualización y las secciones del documento', () => {
    renderPage('privacy');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Política de privacidad' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Última actualización:/)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '1. Responsable del tratamiento' })
    ).toBeInTheDocument();
  });

  it('conserva el marcado de párrafos al usar el renderizador compartido', () => {
    renderPage('privacy');

    const paragraph = screen.getByText(
      'No tomamos decisiones automatizadas ni elaboramos perfiles sobre ti.'
    );

    expect(paragraph.tagName).toBe('P');
    expect(paragraph.closest('article')).not.toBeNull();
    expect(
      paragraph.parentElement?.querySelectorAll('p').length
    ).toBeGreaterThan(0);
  });

  it('conserva las tablas de la política de cookies con sus columnas', () => {
    renderPage('cookies');

    expect(
      screen.getAllByRole('columnheader', { name: 'Nombre' })
    ).toHaveLength(3);
    expect(
      screen.getByRole('cell', {
        name: 'Recuerda el idioma en el que se muestra la web.',
      })
    ).toBeInTheDocument();
  });
});
