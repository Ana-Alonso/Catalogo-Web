import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../i18n';
import { ProductCard } from './ProductCard';
import type { CatalogItem } from '../../types/catalog';

const longDescription = 'Acuarela original sobre papel de algodón de 300 g. '.repeat(6).trim();

const shortDescription = 'Ilustración tamaño A5 en papel reciclado.';

const buildItem = (overrides: Partial<CatalogItem>): CatalogItem => ({
  id: 'obra-1',
  title: 'Paisaje de otoño',
  description: longDescription,
  image: 'https://example.com/obra.jpg',
  category: 'ilustraciones',
  status: 'disponible',
  ...overrides,
});

const renderCard = (item: CatalogItem) =>
  render(
    <MemoryRouter>
      <ProductCard item={item} onRegister={vi.fn()} />
    </MemoryRouter>
  );

const description = () => screen.getByText(longDescription);

describe('ProductCard', () => {
  it('recorta las descripciones largas y ofrece desplegarlas', async () => {
    const user = userEvent.setup();
    renderCard(buildItem({}));

    const toggle = screen.getByRole('button', { name: i18n.t('product.readMore') });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'product-description-obra-1');
    expect(description()).toHaveClass('line-clamp-3');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(description()).not.toHaveClass('line-clamp-3');
    expect(
      screen.getByRole('button', { name: i18n.t('product.readLess') })
    ).toBeInTheDocument();
  });

  it('no muestra el desplegable cuando la descripción es breve', () => {
    renderCard(buildItem({ description: shortDescription }));

    expect(screen.queryByRole('button', { name: i18n.t('product.readMore') })).toBeNull();
    expect(screen.getByText(shortDescription)).not.toHaveClass('line-clamp-3');
  });

  it('muestra la oferta de Etsy como insignia sin recalcular el precio', () => {
    const { container } = renderCard(
      buildItem({
        source: 'etsy',
        currency: 'EUR',
        priceCents: 1000,
        etsyOnSale: true,
      })
    );

    expect(screen.getByText(i18n.t('product.offerBadge'))).toBeInTheDocument();
    expect(container.querySelector('s')).toBeNull();
    expect(container.textContent).toContain('10,00');
  });

  it('trata igual la oferta local: insignia y precio rebajado', () => {
    const { container } = renderCard(
      buildItem({ source: 'local', currency: 'EUR', priceCents: 1000, discountPercent: 20 })
    );

    expect(screen.getByText(i18n.t('product.offerBadge'))).toBeInTheDocument();
    expect(container.querySelector('s')).toBeNull();
    expect(container.textContent).toContain('8,00');
    expect(container.textContent).not.toContain('10,00');
  });

  it('ignora el descuento manual en un producto de Etsy', () => {
    const { container } = renderCard(
      buildItem({ source: 'etsy', currency: 'EUR', priceCents: 1000, discountPercent: 20 })
    );

    expect(screen.queryByText(i18n.t('product.offerBadge'))).toBeNull();
    expect(container.textContent).toContain('10,00');
  });

  it('ignora el marcado de oferta de Etsy en un producto local', () => {
    const { container } = renderCard(
      buildItem({ source: 'local', currency: 'EUR', priceCents: 1000, etsyOnSale: true })
    );

    expect(screen.queryByText(i18n.t('product.offerBadge'))).toBeNull();
    expect(container.textContent).toContain('10,00');
  });

  it('marca en oferta un producto de Etsy sin precio sincronizado', () => {
    renderCard(buildItem({ source: 'etsy', priceCents: null, etsyOnSale: true }));

    expect(screen.getByText(i18n.t('product.offerBadge'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('product.consult'))).toBeInTheDocument();
  });
});

describe('ProductCard · plazo de inscripción de talleres', () => {
  const inDays = (days: number) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const workshop = (overrides: Partial<CatalogItem> = {}) =>
    buildItem({
      category: 'talleres',
      title: 'Taller de acuarela',
      ...overrides,
    });

  it('permite inscribirse y anuncia la fecha límite cuando el plazo sigue abierto', () => {
    renderCard(workshop({ registrationDeadline: inDays(3) }));

    expect(
      screen.getByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('product.registrationDaysLeft', { days: 3 }))).toBeInTheDocument();
  });

  it('oculta el botón y avisa cuando el plazo ya venció', () => {
    const deadline = inDays(-2);
    renderCard(workshop({ registrationDeadline: deadline, cupo: 8 }));

    expect(
      screen.queryByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
    ).toBeNull();
    expect(screen.getByText(/registration closed|plazo de inscripción finalizó/i)).toBeInTheDocument();
  });

  it('no muestra las plazas cuando el plazo de inscripción ya venció', () => {
    renderCard(workshop({ registrationDeadline: inDays(-2), cupo: 8 }));

    expect(
      screen.queryByText(i18n.t('product.spotsLeft', { spots: 8, total: 8 }))
    ).toBeNull();
    expect(screen.queryByText(i18n.t('product.spotsOpen'))).toBeNull();
  });

  it('oculta el botón y avisa cuando el taller ya se celebró', () => {
    renderCard(workshop({ eventDate: inDays(-1) }));

    expect(
      screen.queryByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
    ).toBeNull();
    expect(
      screen.getByText(i18n.t('product.workshopPassed'))
    ).toBeInTheDocument();
  });

  it('no muestra las plazas cuando el taller ya se celebró', () => {
    renderCard(workshop({ eventDate: inDays(-1), cupo: 8 }));

    expect(
      screen.queryByText(i18n.t('product.spotsLeft', { spots: 8, total: 8 }))
    ).toBeNull();
  });

  it('oculta el botón cuando no quedan plazas', () => {
    render(
      <MemoryRouter>
        <ProductCard item={workshop({ cupo: 2 })} spotsCount={2} onRegister={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
    ).toBeNull();
    expect(screen.getByText(i18n.t('product.workshopFull'))).toBeInTheDocument();
  });

  it('mantiene la inscripción abierta sin plazo definido', () => {
    renderCard(workshop({ registrationDeadline: null }));

    expect(
      screen.getByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
    ).toBeInTheDocument();
  });

  it('cierra la inscripción sin recargar cuando vence el plazo', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));
      renderCard(workshop({ registrationDeadline: '2026-11-05T12:00:30.000Z' }));

      expect(
        screen.getByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
      ).toBeInTheDocument();
      expect(screen.queryByText(i18n.t('product.spotsOpen'))).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(30_000);
      });

      expect(
        screen.queryByRole('button', { name: i18n.t('product.signupAria', { title: 'Taller de acuarela' }) })
      ).toBeNull();
      expect(screen.queryByText(i18n.t('product.spotsOpen'))).toBeNull();
      expect(screen.getByText(/plazo de inscripción finalizó/i)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('ProductCard · reservas de productos especiales', () => {
  const inDays = (days: number) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const special = (overrides: Partial<CatalogItem> = {}) =>
    buildItem({
      category: 'especiales',
      title: 'Edición de temporada',
      etsyLink: 'https://www.etsy.com/listing/1',
      ...overrides,
    });

  const signupButton = () =>
    screen.queryByRole('button', {
      name: i18n.t('product.reserveAria', { title: 'Edición de temporada' }),
    });

  it('ofrece reservar cuando la edición activa las reservas con cupo y plazo', () => {
    renderCard(special({ cupo: 10, registrationDeadline: inDays(5) }));

    expect(signupButton()).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('product.buyEtsy'))).toBeNull();
  });

  it('muestra el enlace de compra cuando la edición no activa las reservas', () => {
    renderCard(special({ status: 'reservado' }));

    expect(signupButton()).toBeNull();
    expect(screen.getByText(i18n.t('product.buyEtsy'))).toBeInTheDocument();
  });

  it('anuncia las unidades restantes de una tirada', () => {
    render(
      <MemoryRouter>
        <ProductCard item={special({ cupo: 4 })} spotsCount={1} onRegister={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(i18n.t('product.spotsLeftUnits', { spots: 3, total: 4 }))
    ).toBeInTheDocument();
  });

  it('anuncia «hasta agotar existencias» cuando el cupo está vacío', () => {
    render(
      <MemoryRouter>
        <ProductCard
          item={special({ cupo: null, registrationDeadline: inDays(5) })}
          onRegister={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(i18n.t('product.unitsOpen'))).toBeInTheDocument();
  });

  it('ignora la fecha de evento heredada en una edición especial', () => {
    render(
      <MemoryRouter>
        <ProductCard
          item={special({ cupo: 4, eventDate: inDays(10), eventLocation: 'Madrid' })}
          spotsCount={0}
          onRegister={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Madrid')).toBeNull();
    expect(signupButton()).toBeInTheDocument();
  });

  it('anuncia el plazo en términos de reserva, no de inscripción', () => {
    renderCard(special({ cupo: 10, registrationDeadline: inDays(5) }));

    expect(
      screen.getByText(i18n.t('product.reserveDaysLeft', { days: 5 }))
    ).toBeInTheDocument();
    expect(screen.getByText(/Reservas hasta el/)).toBeInTheDocument();
    expect(screen.queryByText(/inscripci/i)).toBeNull();
  });

  it('avisa del cierre del plazo de reserva sin hablar de inscripciones', () => {
    renderCard(special({ cupo: 5, registrationDeadline: inDays(-2) }));

    expect(screen.getByText(/plazo de reserva finalizó/)).toBeInTheDocument();
    expect(screen.queryByText(/inscripci/i)).toBeNull();
    expect(signupButton()).toBeNull();
  });

  it('muestra un banner de edición cancelada, no de taller cancelado', () => {
    renderCard(special({ cupo: 4, workshopCancelled: true }));

    expect(
      screen.getByText(i18n.t('product.editionCancelled'))
    ).toBeInTheDocument();
    expect(
      screen.queryByText(i18n.t('product.workshopCancelled'))
    ).toBeNull();
  });
});
