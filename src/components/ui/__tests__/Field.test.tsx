import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select, Textarea } from '../Field';

describe('Field controls', () => {
  it('enlaza el mensaje de error del Select con aria-invalid y aria-describedby', () => {
    render(
      <Select id="prod-category" label="Categoría" error="La categoría es obligatoria">
        <option value="a">A</option>
      </Select>
    );

    const select = screen.getByLabelText('Categoría');
    expect(select).toHaveAttribute('aria-invalid', 'true');

    const describedBy = select.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const message = document.getElementById(describedBy as string);
    expect(message).not.toBeNull();
    expect(message).toHaveTextContent('La categoría es obligatoria');
  });

  it('enlaza el mensaje de error del Textarea con aria-invalid y aria-describedby', () => {
    render(
      <Textarea id="prod-desc" label="Descripción" error="Faltan detalles" />
    );

    const textarea = screen.getByLabelText('Descripción');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent('Faltan detalles');
  });

  it('no añade atributos ARIA de error cuando no hay error', () => {
    render(
      <Select id="prod-status" label="Estado">
        <option value="a">A</option>
      </Select>
    );

    const select = screen.getByLabelText('Estado');
    expect(select).not.toHaveAttribute('aria-invalid');
    expect(select).not.toHaveAttribute('aria-describedby');
  });
});
