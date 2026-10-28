import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../../i18n';
import AdminRegistrationsExportButton from '../AdminRegistrationsExportButton';
import ToastProvider from '../../../toast/ToastProvider';
import { downloadCsvFile } from '../../../../utils/registrationsCsv';
import type { CatalogItem } from '../../../../types/catalog';
import type { WorkshopRegistration } from '../../../../types/registrations';

vi.mock('../../../../utils/registrationsCsv', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('../../../../utils/registrationsCsv')
  >();

  return { ...module, downloadCsvFile: vi.fn() };
});

const workshop: CatalogItem = {
  id: 't1',
  title: 'Taller Creativo de Pintura',
  description: 'Sesión presencial',
  image: '/img/taller.jpg',
  category: 'talleres',
  status: 'disponible',
};

const registration = (
  overrides: Partial<WorkshopRegistration> = {}
): WorkshopRegistration => ({
  id: 'r1',
  product_id: 't1',
  name: 'Ana',
  email: 'ana@mail.com',
  status: 'pendiente',
  privacy_consent_at: '2026-10-20T10:00:00.000Z',
  marketing_consent: true,
  created_at: '2026-10-20T10:00:00.000Z',
  ...overrides,
});

const renderButton = (registrations: WorkshopRegistration[]) =>
  render(
    <ToastProvider>
      <AdminRegistrationsExportButton
        registrations={registrations}
        workshops={[workshop]}
      />
    </ToastProvider>
  );

describe('AdminRegistrationsExportButton', () => {
  it('se deshabilita cuando nadie pidió el aviso', () => {
    renderButton([registration({ marketing_consent: false })]);

    const boton = screen.getByRole('button', {
      name: i18n.t('admin.registrations.exportAria'),
    });

    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute(
      'title',
      i18n.t('admin.registrations.exportDisabledHint')
    );
  });

  it('descarga el CSV de las personas con consentimiento', async () => {
    const user = userEvent.setup();
    renderButton([
      registration(),
      registration({ id: 'r2', marketing_consent: false }),
      registration({ id: 'r3', name: 'Luis', status: 'cancelado' }),
    ]);

    await user.click(
      screen.getByRole('button', {
        name: i18n.t('admin.registrations.exportAria'),
      })
    );

    expect(vi.mocked(downloadCsvFile)).toHaveBeenCalledTimes(1);

    const [nombre, csv] = vi.mocked(downloadCsvFile).mock.calls[0];

    expect(nombre).toMatch(/^avisos-talleres-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(csv).toContain('Ana;ana@mail.com;Taller Creativo de Pintura');
    expect(csv).toContain('Luis;ana@mail.com');
    expect(csv.trim().split('\r\n')).toHaveLength(3);
  });
});
