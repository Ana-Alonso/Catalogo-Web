import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminDashboardTabs } from '../AdminDashboardTabs';
import type { AdminTab } from '../../../hooks/useAdminTab';

const counts: Partial<Record<AdminTab, number>> = {
  catalogo: 4,
  talleres: 2,
  archivados: 7,
};

const renderTabs = (activeTab: AdminTab) =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AdminDashboardTabs activeTab={activeTab} counts={counts} />
    </MemoryRouter>
  );

describe('AdminDashboardTabs', () => {
  it('marca la pestaña activa con aria-current', () => {
    renderTabs('talleres');

    expect(screen.getByRole('link', { name: /Talleres/ })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(
      screen.getByRole('link', { name: /Añadir producto/ })
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getByRole('link', { name: /Archivados/ })
    ).not.toHaveAttribute('aria-current');
  });

  it('enlaza cada pestaña con su parámetro de búsqueda', () => {
    renderTabs('productos');

    expect(
      screen.getByRole('link', { name: /Añadir producto/ })
    ).toHaveAttribute('href', '/admin?tab=productos');
    expect(screen.getByRole('link', { name: /Catálogo/ })).toHaveAttribute(
      'href',
      '/admin?tab=catalogo'
    );
    expect(screen.getByRole('link', { name: /Talleres/ })).toHaveAttribute(
      'href',
      '/admin?tab=talleres'
    );
    expect(screen.getByRole('link', { name: /Archivados/ })).toHaveAttribute(
      'href',
      '/admin?tab=archivados'
    );
  });

  it('muestra el contador de cada sección con datos', () => {
    renderTabs('archivados');

    expect(screen.getByRole('link', { name: /Catálogo/ })).toHaveTextContent(
      '4'
    );
    expect(screen.getByRole('link', { name: /Talleres/ })).toHaveTextContent(
      '2'
    );
    expect(screen.getByRole('link', { name: /Archivados/ })).toHaveTextContent(
      '7'
    );
    expect(
      screen.getByRole('link', { name: /Añadir producto/ })
    ).not.toHaveTextContent(/\d/);
  });

  it('marca la pestaña de catálogo cuando está activa', () => {
    renderTabs('catalogo');

    expect(screen.getByRole('link', { name: /Catálogo/ })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('expone una etiqueta accesible para la navegación', () => {
    renderTabs('productos');

    expect(
      screen.getByRole('navigation', { name: 'Secciones del panel' })
    ).toBeInTheDocument();
  });
});
