import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../i18n';
import Navbar from '../Navbar';

const renderNavbar = (onSelectCategory = vi.fn()) => {
  render(
    <MemoryRouter initialEntries={['/es']}>
      <Navbar activeCategory="todas" onSelectCategory={onSelectCategory} />
    </MemoryRouter>
  );
  return {
    onSelectCategory,
    user: userEvent.setup(),
    toggle: screen.getByRole('button', { name: i18n.t('nav.openMenu') }),
  };
};

const menuLinks = () =>
  screen.getAllByRole('link', { name: i18n.t('nav.links.all') });

describe('Navbar', () => {
  it('alterna aria-expanded con el botón de menú', async () => {
    const { user, toggle } = renderNavbar();

    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName(i18n.t('nav.closeMenu'));

    await user.click(toggle);
    await waitFor(() => expect(menuLinks()).toHaveLength(1), { timeout: 3000 });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('desmonta el desplegable al cerrar y solo existe el enlace de escritorio', async () => {
    const { user, toggle } = renderNavbar();

    expect(menuLinks()).toHaveLength(1);

    await user.click(toggle);
    await waitFor(() => expect(menuLinks()).toHaveLength(2));

    await user.click(toggle);
    await waitFor(() => expect(menuLinks()).toHaveLength(1), { timeout: 3000 });
  });

  it('permite navegar con teclado desde el botón hasta el primer enlace y cierra al activarlo', async () => {
    const { onSelectCategory, user, toggle } = renderNavbar();

    await user.click(toggle);
    await waitFor(() => expect(menuLinks()).toHaveLength(2));

    await user.tab();
    const mobileFirstLink = menuLinks()[1];
    expect(mobileFirstLink).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelectCategory).toHaveBeenCalledWith('todas');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(menuLinks()).toHaveLength(1), { timeout: 3000 });
  });

  it('no anima la propiedad height al abrir el desplegable', async () => {
    const { user, toggle } = renderNavbar();
    const nav = screen.getByRole('navigation', {
      name: i18n.t('nav.ariaLabel'),
    });

    await user.click(toggle);
    await waitFor(() => expect(menuLinks()).toHaveLength(2));

    for (
      let element = menuLinks()[1].parentElement;
      element && element !== nav;
      element = element.parentElement
    ) {
      expect(element.style.height).toBe('');
    }
  });
});
