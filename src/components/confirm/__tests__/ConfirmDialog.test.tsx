import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../i18n';
import { ConfirmProvider } from '../ConfirmProvider';
import { useConfirm } from '../../../hooks/useConfirm';

const Harness: React.FC<{ onResult: (isConfirmed: boolean) => void }> = ({
  onResult,
}) => {
  const confirm = useConfirm();

  return (
    <button
      type="button"
      onClick={() => {
        void confirm({
          message: '¿Eliminar la obra?',
          confirmLabel: i18n.t('common.delete'),
          isDanger: true,
        }).then(onResult);
      }}
    >
      eliminar
    </button>
  );
};

const renderConfirm = () => {
  const onResult = vi.fn();
  render(
    <MemoryRouter>
      <ConfirmProvider>
        <Harness onResult={onResult} />
      </ConfirmProvider>
    </MemoryRouter>
  );
  return {
    onResult,
    trigger: screen.getByRole('button', { name: 'eliminar' }),
    user: userEvent.setup(),
  };
};

const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'eliminar' }));
  return screen.findByRole('dialog');
};

describe('ConfirmDialog', () => {
  it('resuelve true al confirmar y cierra el diálogo', async () => {
    const { onResult, user } = renderConfirm();
    await openDialog(user);

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    );

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('resuelve false al cancelar', async () => {
    const { onResult, user } = renderConfirm();
    await openDialog(user);

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.cancel') })
    );

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });

  it('resuelve false con Escape', async () => {
    const { onResult, user } = renderConfirm();
    await openDialog(user);

    await user.keyboard('{Escape}');

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('mantiene el foco dentro del diálogo y lo devuelve al trigger', async () => {
    const { onResult, trigger, user } = renderConfirm();
    const dialog = await openDialog(user);

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.cancel') })
    );

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('usa el título por defecto cuando la petición no lo indica', async () => {
    const { user } = renderConfirm();
    const dialog = await openDialog(user);

    expect(dialog).toHaveAccessibleName(i18n.t('common.confirmTitle'));
  });

  it('descarta la petición pendiente cuando se abre otra encima', async () => {
    const { onResult, trigger, user } = renderConfirm();
    await openDialog(user);

    await user.click(trigger);

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });
});
