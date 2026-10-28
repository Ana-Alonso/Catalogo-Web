import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../../i18n';
import AdminEtsyOffersPanel from '../AdminEtsyOffersPanel';
import ToastProvider from '../../../toast/ToastProvider';
import type { CatalogItem } from '../../../../types/catalog';

const etsyProduct = (overrides: Partial<CatalogItem>): CatalogItem => ({
  id: `etsy-${Math.random()}`,
  title: 'Ilustración de polillas',
  description: 'Arte lineal.',
  image: 'https://example.com/obra.jpg',
  category: 'ilustraciones',
  status: 'disponible',
  source: 'etsy',
  priceCents: 495,
  ...overrides,
});

const localProduct = (): CatalogItem => ({
  ...etsyProduct({}),
  id: 'local-1',
  source: 'local',
  discountPercent: 10,
});

const renderPanel = (
  products: CatalogItem[],
  onApply = vi.fn().mockResolvedValue(2)
) => {
  render(
    <MemoryRouter>
      <ToastProvider>
        <AdminEtsyOffersPanel products={products} onApply={onApply} />
      </ToastProvider>
    </MemoryRouter>
  );
  return onApply;
};

describe('AdminEtsyOffersPanel', () => {
  it('resume cuántos productos de Etsy están en oferta', () => {
    renderPanel([
      etsyProduct({ etsyOnSale: true }),
      etsyProduct({}),
      localProduct(),
    ]);

    expect(
      screen.getByText(
        i18n.t('admin.etsyOffers.summary', { onSale: 1, total: 2 })
      )
    ).toBeInTheDocument();
  });

  it('propaga el marcado de oferta a todos los productos de Etsy', async () => {
    const user = userEvent.setup();
    const onApply = renderPanel([etsyProduct({}), localProduct()]);

    await user.click(
      screen.getByRole('button', { name: i18n.t('admin.etsyOffers.markAll') })
    );

    expect(onApply).toHaveBeenCalledWith(true);
    expect(
      await screen.findByRole('status')
    ).toHaveTextContent(
      i18n.t('admin.etsyOffers.applied', {
        affected: 2,
        state: i18n.t('admin.etsyOffers.stateOn'),
      })
    );
  });

  it('permite quitar la oferta a todas', async () => {
    const user = userEvent.setup();
    const onApply = renderPanel([etsyProduct({ etsyOnSale: true })]);

    await user.click(
      screen.getByRole('button', { name: i18n.t('admin.etsyOffers.clearAll') })
    );

    expect(onApply).toHaveBeenCalledWith(false);
  });

  it('informa cuando la propagación falla', async () => {
    const user = userEvent.setup();
    renderPanel([etsyProduct({})], vi.fn().mockResolvedValue(null));

    await user.click(
      screen.getByRole('button', { name: i18n.t('admin.etsyOffers.markAll') })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(i18n.t('admin.etsyOffers.error'));
  });

  it('bloquea las acciones si el catálogo aún no tiene productos de Etsy', () => {
    renderPanel([localProduct()]);

    expect(
      screen.getByRole('button', { name: i18n.t('admin.etsyOffers.markAll') })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: i18n.t('admin.etsyOffers.clearAll') })
    ).toBeDisabled();
  });
});
