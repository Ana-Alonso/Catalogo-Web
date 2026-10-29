import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('anuncia sus controles de carrusel en el idioma activo', () => {
    render(<BookShowcase />);

    expect(
      screen.getByRole('button', { name: 'Imagen anterior' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Imagen siguiente' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ir a la imagen 3' })
    ).toBeInTheDocument();
  });
});

const pressedSlide = (position: number): HTMLElement =>
  screen.getByRole('button', { name: `Ir a la imagen ${position}` });

const setReducedMotionPreference = (isReduced: boolean): void => {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: isReduced,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList
  );
};

const advance = (ms: number): void => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

describe('autoavance del carrusel', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('muestra la portada siguiente cuando pasa el intervalo', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(false);
    render(<BookShowcase />);

    expect(pressedSlide(1)).toHaveAttribute('aria-pressed', 'true');

    advance(4_000);

    expect(pressedSlide(2)).toHaveAttribute('aria-pressed', 'true');
  });

  it('no avanza solo cuando la visitante prefiere movimiento reducido', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(true);
    render(<BookShowcase />);

    advance(12_000);

    expect(pressedSlide(1)).toHaveAttribute('aria-pressed', 'true');
    expect(pressedSlide(2)).toHaveAttribute('aria-pressed', 'false');
  });

  it('pausa el autoavance mientras el cursor está sobre el carrusel', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(false);
    render(<BookShowcase />);

    fireEvent.pointerOver(screen.getByRole('button', { name: i18n.t('book.imageAlt') }));

    advance(12_000);

    expect(pressedSlide(1)).toHaveAttribute('aria-pressed', 'true');
  });

  it('pausa el autoavance mientras el foco está dentro del carrusel', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(false);
    render(<BookShowcase />);

    fireEvent.focus(screen.getByRole('button', { name: i18n.t('book.imageAlt') }));

    advance(12_000);

    expect(pressedSlide(1)).toHaveAttribute('aria-pressed', 'true');
  });

  it('pausa el autoavance mientras el lightbox está abierto', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(false);
    render(<BookShowcase />);

    fireEvent.click(screen.getByRole('button', { name: i18n.t('book.imageAlt') }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    advance(12_000);

    expect(pressedSlide(1)).toHaveAttribute('aria-pressed', 'true');
  });
});
