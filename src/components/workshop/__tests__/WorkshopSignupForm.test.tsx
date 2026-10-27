import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../i18n';
import { WorkshopSignupForm } from '../WorkshopSignupForm';
import type { CatalogItem } from '../../../types/catalog';
import type { RegistrationFormData } from '../../../types/registrations';

const workshop: CatalogItem = {
  id: 'taller-1',
  title: 'Taller de acuarela',
  description: 'Sesión introductoria.',
  image: 'https://example.com/taller.jpg',
  category: 'talleres',
  status: 'disponible',
};

const fillIdentity = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(i18n.t('workshop.form.nameLabel')), 'Ana');
  await user.type(screen.getByLabelText(i18n.t('workshop.form.emailLabel')), 'ana@example.com');
};

const renderForm = (onRegister: (data: RegistrationFormData) => Promise<void>) =>
  render(
    <MemoryRouter initialEntries={['/es']}>
      <WorkshopSignupForm workshop={workshop} onRegister={onRegister} onClose={vi.fn()} />
    </MemoryRouter>
  );

describe('WorkshopSignupForm', () => {
  it('exige aceptar la política de privacidad antes de inscribirse', async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn().mockResolvedValue(undefined);
    renderForm(onRegister);

    await fillIdentity(user);
    await user.click(screen.getByRole('button', { name: i18n.t('workshop.form.submit') }));

    const privacyAlert = await screen.findByText(
      i18n.t('workshop.form.errors.privacyRequired')
    );
    expect(privacyAlert).toHaveAttribute('role', 'alert');
    expect(onRegister).not.toHaveBeenCalled();
    expect(screen.queryByText(i18n.t('workshop.form.successTitle'))).toBeNull();
  });

  it('envía la inscripción marcando el consentimiento obligatorio', async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn().mockResolvedValue(undefined);
    renderForm(onRegister);

    await fillIdentity(user);
    await user.click(
      screen.getByRole('checkbox', { name: /política de privacidad/i })
    );
    await user.click(screen.getByRole('button', { name: i18n.t('workshop.form.submit') }));

    await waitFor(() => expect(onRegister).toHaveBeenCalled());
    expect(onRegister).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@example.com',
      privacyConsent: true,
      marketingConsent: false,
    });
    expect(
      await screen.findByText(i18n.t('workshop.form.successTitle'))
    ).toBeInTheDocument();
  });

  it('registra el aviso opcional de futuros talleres cuando se marca', async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn().mockResolvedValue(undefined);
    renderForm(onRegister);

    await fillIdentity(user);
    await user.click(screen.getByRole('checkbox', { name: /política de privacidad/i }));
    await user.click(
      screen.getByRole('checkbox', { name: i18n.t('workshop.form.marketingLabel') })
    );
    await user.click(screen.getByRole('button', { name: i18n.t('workshop.form.submit') }));

    await waitFor(() =>
      expect(onRegister).toHaveBeenCalledWith(
        expect.objectContaining({ marketingConsent: true })
      )
    );
  });

  it('enlaza la política de privacidad desde la casilla sin marcarla al pulsar', async () => {
    const user = userEvent.setup();
    renderForm(vi.fn().mockResolvedValue(undefined));

    const privacyLink = screen.getByRole('link', { name: /política de privacidad/i });
    expect(privacyLink).toHaveAttribute('href', '/es/privacidad');

    await user.click(privacyLink);

    expect(screen.getByRole('checkbox', { name: /política de privacidad/i })).not.toBeChecked();
  });

  it('valida el email antes de pedir el consentimiento', async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn().mockResolvedValue(undefined);
    renderForm(onRegister);

    await fillIdentity(user);
    await user.clear(screen.getByLabelText(i18n.t('workshop.form.emailLabel')));
    await user.type(screen.getByLabelText(i18n.t('workshop.form.emailLabel')), 'no-es-un-email');
    await user.click(screen.getByRole('button', { name: i18n.t('workshop.form.submit') }));

    expect(onRegister).not.toHaveBeenCalled();
    expect(
      await screen.findByText(i18n.t('workshop.form.errors.invalidEmail'))
    ).toBeInTheDocument();
  });
});
