import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../../i18n';
import AdminEtsyProductForm from '../AdminEtsyProductForm';
import type { CatalogItem } from '../../../../types/catalog';

const buildProduct = (overrides: Partial<CatalogItem>): CatalogItem => ({
  id: 'etsy-1',
  title: 'Ilustración de polillas',
  description: 'Arte lineal minimalista en blanco y negro.',
  image: 'https://example.com/obra.jpg',
  category: 'ilustraciones',
  status: 'disponible',
  source: 'etsy',
  currency: 'EUR',
  priceCents: 1000,
  etsyListingId: 4600096567,
  ...overrides,
});

const offerCheckbox = () =>
  screen.getByRole('checkbox', { name: i18n.t('admin.etsyForm.offerLabel') });

const saveButton = () =>
  screen.getByRole('button', { name: i18n.t('admin.etsyForm.saveChanges') });

const renderForm = (
  product: CatalogItem,
  onSubmit = vi.fn().mockResolvedValue(true)
) => {
  render(
    <MemoryRouter>
      <AdminEtsyProductForm
        product={product}
        onSubmit={onSubmit}
        isSubmitting={false}
        onCancelEdit={vi.fn()}
      />
    </MemoryRouter>
  );
  return onSubmit;
};

describe('AdminEtsyProductForm', () => {
  it('envía el marcado de oferta junto a la categoría', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({}));

    await user.click(offerCheckbox());
    await user.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'ilustraciones',
      etsyOnSale: true,
    });
  });

  it('arranca con la oferta ya marcada y permite quitarla', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({ etsyOnSale: true }));

    expect(offerCheckbox()).toBeChecked();

    await user.click(offerCheckbox());
    await user.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'ilustraciones',
      etsyOnSale: false,
    });
  });

  it('cambia la categoría sin tocar el marcado de oferta', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({ etsyOnSale: true }));

    await user.selectOptions(
      screen.getByLabelText(i18n.t('admin.etsyForm.categoryLabel')),
      'camisetas'
    );
    await user.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'camisetas',
      etsyOnSale: true,
    });
  });

  it('muestra el precio sincronizado sin porcentaje ni tachado', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminEtsyProductForm
          product={buildProduct({ etsyOnSale: true })}
          onSubmit={vi.fn()}
          isSubmitting={false}
          onCancelEdit={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(container.querySelector('s')).toBeNull();
    expect(container.textContent).toContain('10,00');
    expect(container.textContent).not.toContain('%');
  });

  it('indica que el precio no ha llegado todavía de Etsy', () => {
    renderForm(buildProduct({ priceCents: null }));

    expect(
      screen.getByText(i18n.t('admin.etsyForm.priceOnRequest'))
    ).toBeInTheDocument();
  });

  it('avisa cuando el guardado falla', async () => {
    const user = userEvent.setup();
    renderForm(buildProduct({}), vi.fn().mockResolvedValue(false));

    await user.click(saveButton());

    expect(
      await screen.findByText(i18n.t('admin.etsyForm.saveError'))
    ).toBeInTheDocument();
  });
});
