import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminDashboardTabs } from '../AdminDashboardTabs';
import type { AdminTab } from '../../../hooks/useAdminTab';

const counts: Record<AdminTab, number> = {
  productos: 4,
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
    expect(screen.getByRole('link', { name: /Productos/ })).not.toHaveAttribute(
      'aria-current'
    );
    expect(
      screen.getByRole('link', { name: /Archivados/ })
    ).not.toHaveAttribute('aria-current');
  });

  it('enlaza cada pestaña con su parámetro de búsqueda', () => {
    renderTabs('productos');

    expect(screen.getByRole('link', { name: /Talleres/ })).toHaveAttribute(
      'href',
      '/admin?tab=talleres'
    );
    expect(screen.getByRole('link', { name: /Archivados/ })).toHaveAttribute(
      'href',
      '/admin?tab=archivados'
    );
  });

  it('muestra el contador de cada sección', () => {
    renderTabs('archivados');

    expect(screen.getByRole('link', { name: /Productos/ })).toHaveTextContent(
      '4'
    );
    expect(screen.getByRole('link', { name: /Talleres/ })).toHaveTextContent(
      '2'
    );
    expect(screen.getByRole('link', { name: /Archivados/ })).toHaveTextContent(
      '7'
    );
  });

  it('marca la pestaña de productos cuando está activa', () => {
    renderTabs('productos');

    expect(screen.getByRole('link', { name: /Productos/ })).toHaveAttribute(
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
