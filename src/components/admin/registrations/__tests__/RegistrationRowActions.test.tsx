import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationRowActions } from '../RegistrationRowActions';
import { ConfirmProvider } from '../../../confirm/ConfirmProvider';
import ToastProvider from '../../../toast/ToastProvider';
import type { WorkshopRegistration } from '../../../../types/registrations';

const registration = (
  overrides: Partial<WorkshopRegistration> = {}
): WorkshopRegistration => ({
  id: 'r-1',
  product_id: 'w-1',
  name: 'Ana García',
  email: 'ana@example.com',
  status: 'pendiente',
  privacy_consent_at: '2026-09-01T10:00:00.000Z',
  marketing_consent: false,
  created_at: '2026-09-01T10:00:00.000Z',
  ...overrides,
});

const buildProps = (item: WorkshopRegistration) => ({
  registration: item,
  onSetStatus: vi.fn().mockResolvedValue(true),
  onWithdrawMarketingConsent: vi.fn().mockResolvedValue(true),
  onDelete: vi.fn().mockResolvedValue(true),
});

const renderActions = (item: WorkshopRegistration) =>
  render(
    <ConfirmProvider>
      <ToastProvider>
        <RegistrationRowActions {...buildProps(item)} />
      </ToastProvider>
    </ConfirmProvider>
  );

describe('RegistrationRowActions', () => {
  it('bloquea el borrado mientras hay consentimiento de avisos', () => {
    renderActions(registration({ marketing_consent: true }));

    expect(
      screen.getByRole('button', {
        name: 'Los datos de Ana García están protegidos por consentimiento de avisos',
      })
    ).toBeDisabled();
  });

  it('muestra la acción de retirar avisos solo con consentimiento', () => {
    renderActions(registration({ marketing_consent: true }));

    expect(
      screen.getByRole('button', {
        name: 'Retirar el consentimiento de avisos de Ana García',
      })
    ).toBeInTheDocument();
  });

  it('no muestra la acción de retirar avisos sin consentimiento', () => {
    renderActions(registration());

    expect(
      screen.queryByRole('button', {
        name: 'Retirar el consentimiento de avisos de Ana García',
      })
    ).not.toBeInTheDocument();
  });

  it('retira el consentimiento tras confirmar', async () => {
    const user = userEvent.setup();
    const item = registration({ marketing_consent: true });
    const props = buildProps(item);

    render(
      <ConfirmProvider>
        <ToastProvider>
          <RegistrationRowActions {...props} />
        </ToastProvider>
      </ConfirmProvider>
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Retirar el consentimiento de avisos de Ana García',
      })
    );
    await user.click(screen.getByRole('button', { name: 'Retirar avisos' }));

    expect(props.onWithdrawMarketingConsent).toHaveBeenCalledWith('r-1');
    expect(props.onDelete).not.toHaveBeenCalled();
  });

  it('permite borrar cuando ya no hay consentimiento', async () => {
    const user = userEvent.setup();
    const item = registration({ marketing_consent: false });
    const props = buildProps(item);

    render(
      <ConfirmProvider>
        <ToastProvider>
          <RegistrationRowActions {...props} />
        </ToastProvider>
      </ConfirmProvider>
    );

    await user.click(
      screen.getByRole('button', { name: 'Eliminar inscripción de Ana García' })
    );
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(props.onDelete).toHaveBeenCalledWith('r-1');
  });
});
