import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AdminLoginForm } from '../admin/AdminLoginForm';
import i18n, { LANGUAGE_STORAGE_KEY, persistLanguage } from '../../i18n';

const renderSwitcher = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageSwitcher />
    </MemoryRouter>
  );
};

describe('LanguageSwitcher', () => {
  afterEach(async () => {
    await i18n.changeLanguage('es');
    persistLanguage('es');
  });

  it('conserva /admin y cambia el idioma sin añadir prefijo', async () => {
    const user = userEvent.setup();
    await i18n.changeLanguage('es');
    renderSwitcher('/admin');

    const englishLink = screen.getByRole('link', {
      name: i18n.t('language.switchToEnglish'),
    });

    expect(englishLink).toHaveAttribute('href', '/admin');

    await user.click(englishLink);

    await waitFor(() => {
      expect(i18n.resolvedLanguage).toBe('en');
    });
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('renderiza el acceso de administración con el idioma activo', async () => {
    await i18n.changeLanguage('en');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLoginForm
          onLogin={vi.fn().mockResolvedValue(undefined)}
          onClose={vi.fn()}
          errorMessage={null}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Access')).toBeInTheDocument();
    expect(screen.getByText('Sign in to manage the catalog.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
