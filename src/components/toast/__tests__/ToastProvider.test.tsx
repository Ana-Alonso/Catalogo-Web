import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../i18n';
import { ToastProvider } from '../ToastProvider';
import { useToast } from '../../../hooks/useToast';

const Harness: React.FC = () => {
  const { success, error, info } = useToast();

  return (
    <>
      <button type="button" onClick={() => success('primera')}>
        primera
      </button>
      <button type="button" onClick={() => success('segunda')}>
        segunda
      </button>
      <button type="button" onClick={() => success('tercera')}>
        tercera
      </button>
      <button type="button" onClick={() => success('cuarta')}>
        cuarta
      </button>
      <button type="button" onClick={() => error('ha fallado')}>
        error
      </button>
      <button type="button" onClick={() => info('informativo')}>
        info
      </button>
    </>
  );
};

const renderHarness = () =>
  render(
    <MemoryRouter>
      <ToastProvider>
        <Harness />
      </ToastProvider>
    </MemoryRouter>
  );

describe('ToastProvider', () => {
  it('mantiene el contenedor montado aunque no haya avisos', () => {
    renderHarness();

    expect(
      screen.getByRole('region', { name: i18n.t('notifications.title') })
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('muestra el aviso y lo retira al pulsar la X', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'primera' }));

    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent('primera');

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.close') })
    );

    await waitFor(() =>
      expect(screen.queryByRole('status')).toBeNull()
    );
  });

  it('usa role alert para los errores y status para la información', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'error' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('ha fallado');

    await user.click(screen.getByRole('button', { name: 'info' }));
    expect(await screen.findByRole('status')).toHaveTextContent('informativo');
  });

  it('repite el mismo aviso en lugar de apilar dos iguales', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'primera' }));
    await screen.findByRole('status');
    await user.click(screen.getByRole('button', { name: 'primera' }));

    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('muestra como máximo tres avisos y descarta el más antiguo', async () => {
    const user = userEvent.setup();
    renderHarness();

    for (const label of ['primera', 'segunda', 'tercera', 'cuarta']) {
      await user.click(screen.getByRole('button', { name: label }));
    }

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(3));

    const viewport = screen.getByRole('region', {
      name: i18n.t('notifications.title'),
    });
    expect(within(viewport).queryByText('primera')).toBeNull();
    expect(within(viewport).getByText('cuarta')).toBeInTheDocument();
  });

  it('lanza si se usa sin el provider', () => {
    const Probe = () => {
      useToast();
      return null;
    };

    expect(() => render(<Probe />)).toThrow();
  });
});
