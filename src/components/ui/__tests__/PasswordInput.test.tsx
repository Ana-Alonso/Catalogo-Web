import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput', () => {
  it('arranca oculto como type="password"', () => {
    render(<PasswordInput id="pwd" label="Contraseña" />);
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
  });

  it('alterna a visible al pulsar el botón y cambia el aria-label', async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="pwd" label="Contraseña" />);
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument();
  });

  it('vuelve a ocultar al pulsar de nuevo', async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="pwd" label="Contraseña" />);
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' });
    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument();
  });

  it('el botón no envía el formulario', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <form onSubmit={handleSubmit}>
        <PasswordInput id="pwd" label="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
    );
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('mantiene el valor escrito al alternar la visibilidad', async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="pwd" label="Contraseña" defaultValue="secreto123" />);
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(screen.getByLabelText('Contraseña')).toHaveValue('secreto123');
  });
});
