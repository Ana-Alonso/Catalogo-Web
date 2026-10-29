import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../i18n';
import BookShowcase from '../BookShowcase';

const openLightbox = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: i18n.t('book.imageAlt') }));
  return screen.findByRole('dialog');
};

describe('BookShowcase', () => {
  it('expone el lightbox como un diálogo modal con nombre accesible', async () => {
    const user = userEvent.setup();
    render(<BookShowcase />);

    const dialog = await openLightbox(user);

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName();
  });

  it('cierra el lightbox con Escape', async () => {
    const user = userEvent.setup();
    render(<BookShowcase />);

    await openLightbox(user);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('cierra el lightbox desde su botón de cierre', async () => {
    const user = userEvent.setup();
    render(<BookShowcase />);

    const dialog = await openLightbox(user);
    await user.click(
      screen.getByRole('button', { name: i18n.t('common.close') })
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(dialog).not.toBeInTheDocument();
  });

  it('mantiene el foco dentro del lightbox y lo devuelve al trigger', async () => {
    const user = userEvent.setup();
    render(<BookShowcase />);

    const trigger = screen.getByRole('button', { name: i18n.t('book.imageAlt') });
    const dialog = await openLightbox(user);

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
