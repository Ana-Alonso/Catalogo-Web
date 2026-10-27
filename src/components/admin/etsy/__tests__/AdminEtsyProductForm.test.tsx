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

const renderForm = (product: CatalogItem, onSubmit = vi.fn().mockResolvedValue(true)) => {
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

const saveButton = () =>
  screen.getByRole('button', { name: i18n.t('admin.etsyForm.saveChanges') });

describe('AdminEtsyProductForm', () => {
  it('envía la oferta escrita junto a la categoría', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({}));

    await user.type(screen.getByLabelText(i18n.t('admin.etsyForm.offerLabel')), '25');
    await user.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'ilustraciones',
      etsyOfferPercent: 25,
    });
  });

  it('permite retirar una oferta existente', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({ etsyOfferPercent: 30 }));

    await user.clear(screen.getByLabelText(i18n.t('admin.etsyForm.offerLabel')));
    await user.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'ilustraciones',
      etsyOfferPercent: null,
    });
  });

  it('impide guardar una oferta fuera del rango permitido', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({}));
    const offerField = screen.getByLabelText(i18n.t('admin.etsyForm.offerLabel'));

    await user.type(offerField, '120');
    await user.click(saveButton());

    expect(offerField).toHaveAttribute('min', '1');
    expect(offerField).toHaveAttribute('max', '90');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('exige un precio antes de ofrecer un descuento', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(buildProduct({ priceCents: null }));

    await user.type(screen.getByLabelText(i18n.t('admin.etsyForm.offerLabel')), '20');
    await user.click(saveButton());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      await screen.findByText(i18n.t('validation.discountRequiresPrice'))
    ).toBeInTheDocument();
  });

  it('muestra el precio de Etsy tachado cuando ya hay oferta', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminEtsyProductForm
          product={buildProduct({ etsyOfferPercent: 20 })}
          onSubmit={vi.fn()}
          isSubmitting={false}
          onCancelEdit={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(container.querySelector('s')).toHaveTextContent('10,00');
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: i18n.t('admin.etsyForm.offerLabel') })
    ).toHaveValue(20);
  });
});
