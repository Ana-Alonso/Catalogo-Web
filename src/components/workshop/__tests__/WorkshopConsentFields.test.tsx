import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import WorkshopConsentFields from '../WorkshopConsentFields';

const consentMessage = 'Debes aceptar la política de privacidad para continuar.';

const renderFields = (hasPrivacyError: boolean) =>
  render(
    <MemoryRouter initialEntries={['/es']}>
      <WorkshopConsentFields
      privacyConsent={false}
      marketingConsent
      hasPrivacyError={hasPrivacyError}
      onPrivacyConsentChange={vi.fn()}
      onMarketingConsentChange={vi.fn()}
      />
    </MemoryRouter>
  );

describe('WorkshopConsentFields', () => {
  it('enlaza el aviso de privacidad al campo que señala', () => {
    renderFields(true);

    const checkbox = screen.getByRole('checkbox', { name: /He leído y acepto/ });

    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription(consentMessage);
  });

  it('no marca el campo como inválido cuando el consentimiento es correcto', () => {
    renderFields(false);

    const checkbox = screen.getByRole('checkbox', { name: /He leído y acepto/ });

    expect(checkbox).not.toHaveAttribute('aria-invalid');
    expect(checkbox).not.toHaveAccessibleDescription();
  });

  it('deja el consentimiento de marketing independiente del aviso', () => {
    renderFields(true);

    const marketing = screen.getByRole('checkbox', { name: /Quiero que me aviséis/ });

    expect(marketing).not.toHaveAttribute('aria-invalid');
    expect(marketing).not.toHaveAccessibleDescription();
  });
});
