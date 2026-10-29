import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('enlaza el mensaje de error con aria-invalid y aria-describedby', () => {
    render(<Input id="prod-title" label="Título" error="El título es obligatorio" />);

    const input = screen.getByLabelText('Título');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const message = document.getElementById(describedBy as string);
    expect(message).not.toBeNull();
    expect(message).toHaveTextContent('El título es obligatorio');
  });

  it('no añade atributos ARIA de error cuando no hay error', () => {
    render(<Input id="prod-title" label="Título" />);

    const input = screen.getByLabelText('Título');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
