import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
