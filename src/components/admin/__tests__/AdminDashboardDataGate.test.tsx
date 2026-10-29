import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AdminDashboard from '../AdminDashboard';
import ToastProvider from '../../../components/toast/ToastProvider';
import type { User } from '@supabase/supabase-js';

const { fetchProductsMock, fetchRegistrationsMock, authState } = vi.hoisted(() => {
  const fetchProductsMock = vi.fn().mockResolvedValue([]);
  const fetchRegistrationsMock = vi.fn().mockResolvedValue([]);
  const authState = {
    user: null as User | null,
    isAdmin: false,
    isLoading: false,
  };
  return { fetchProductsMock, fetchRegistrationsMock, authState };
});

vi.mock('../../../services/productService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../services/productService')>()),
  fetchProducts: fetchProductsMock,
}));

vi.mock('../../../services/registrationService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../services/registrationService')>()),
  fetchRegistrations: fetchRegistrationsMock,
}));

vi.mock('../../../hooks/useAdminAuth', () => ({
  useAdminAuth: () => ({
    user: authState.user,
    isAdmin: authState.isAdmin,
    isLoading: authState.isLoading,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

const adminUser = { id: 'admin-1', email: 'ana@example.com' } as User;

const buildDashboard = () => (
  <ToastProvider>
    <MemoryRouter>
      <AdminDashboard onClose={vi.fn()} />
    </MemoryRouter>
  </ToastProvider>
);

const renderDashboard = () => render(buildDashboard());

const resetAuth = () => {
  fetchProductsMock.mockClear();
  fetchRegistrationsMock.mockClear();
  authState.user = null;
  authState.isAdmin = false;
  authState.isLoading = false;
};

describe('AdminDashboard · la carga de datos espera a la sesión', () => {
  it('no consulta inscripciones mientras no hay sesión de admin', () => {
    resetAuth();
    renderDashboard();

    expect(screen.getByRole('heading', { name: 'Acceso Administrador' })).toBeVisible();
    expect(fetchProductsMock).not.toHaveBeenCalled();
    expect(fetchRegistrationsMock).not.toHaveBeenCalled();
  });

  it('tampoco consulta mientras la sesión se está recuperando', () => {
    resetAuth();
    authState.isLoading = true;
    renderDashboard();

    expect(fetchProductsMock).not.toHaveBeenCalled();
    expect(fetchRegistrationsMock).not.toHaveBeenCalled();
  });

  it('consulta catálogo e inscripciones cuando la sesión es de admin', () => {
    resetAuth();
    authState.user = adminUser;
    authState.isAdmin = true;
    renderDashboard();

    expect(fetchProductsMock).toHaveBeenCalledTimes(1);
    expect(fetchRegistrationsMock).toHaveBeenCalledTimes(1);
  });

  it('no consulta con una sesión que no es admin', () => {
    resetAuth();
    authState.user = adminUser;
    authState.isAdmin = false;
    renderDashboard();

    expect(fetchProductsMock).not.toHaveBeenCalled();
    expect(fetchRegistrationsMock).not.toHaveBeenCalled();
  });

  it('carga los datos en cuanto la sesión pasa a ser de admin', () => {
    resetAuth();
    const { rerender } = renderDashboard();

    expect(fetchProductsMock).not.toHaveBeenCalled();

    authState.user = adminUser;
    authState.isAdmin = true;

    rerender(buildDashboard());

    expect(fetchProductsMock).toHaveBeenCalledTimes(1);
    expect(fetchRegistrationsMock).toHaveBeenCalledTimes(1);
  });
});
