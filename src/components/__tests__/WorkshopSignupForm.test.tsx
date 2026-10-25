import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkshopSignupForm } from '../WorkshopSignupForm';
import { RegistrationError } from '../../errors/registrationError';
import i18n from '../../i18n';
import type { CatalogItem } from '../../types/catalog';

const workshop: CatalogItem = {
  id: 'w-1',
  title: 'Taller de acuarela',
  description: 'Aprende acuarela desde cero.',
  category: 'talleres',
  image: 'https://example.com/img.png',
  status: 'disponible',
};

const setup = (onRegister = vi.fn().mockResolvedValue(undefined)) => {
  const onClose = vi.fn();
  render(
    <WorkshopSignupForm workshop={workshop} onRegister={onRegister} onClose={onClose} />
  );
  return { onRegister, onClose };
};

describe('WorkshopSignupForm', () => {
  it('muestra error si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: /apuntarme al taller/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Por favor indica tu nombre y tu email.'
    );
  });

  it('muestra error si el email no es válido', async () => {
    const user = userEvent.setup();
    const { onRegister } = setup();
    await user.type(screen.getByLabelText(/tu nombre/i), 'Ana García');
    await user.type(screen.getByLabelText(/tu email/i), 'no-es-un-email');
    await user.click(screen.getByRole('button', { name: /apuntarme al taller/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Introduce un email válido.');
    expect(onRegister).not.toHaveBeenCalled();
  });

  it('envía los datos recortados y muestra la confirmación', async () => {
    const user = userEvent.setup();
    const { onRegister, onClose } = setup();
    await user.type(screen.getByLabelText(/tu nombre/i), '  Ana García  ');
    await user.type(screen.getByLabelText(/tu email/i), '  ana@example.com  ');
    await user.click(screen.getByRole('button', { name: /apuntarme al taller/i }));
    expect(onRegister).toHaveBeenCalledWith({
      name: 'Ana García',
      email: 'ana@example.com',
    });
    expect(await screen.findByText(/¡Inscripción completada!/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cerrar/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /cerrar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('muestra el mensaje del error devuelto por onRegister', async () => {
    const user = userEvent.setup();
    setup(vi.fn().mockRejectedValue(new RegistrationError('workshopFull')));
    await user.type(screen.getByLabelText(/tu nombre/i), 'Ana');
    await user.type(screen.getByLabelText(/tu email/i), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: /apuntarme al taller/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El taller está completo: no quedan plazas.'
    );
  });

  it('muestra mensaje genérico si onRegister falla sin Error', async () => {
    const user = userEvent.setup();
    setup(vi.fn().mockRejectedValue('fallo raro'));
    await user.type(screen.getByLabelText(/tu nombre/i), 'Ana');
    await user.type(screen.getByLabelText(/tu email/i), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: /apuntarme al taller/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo completar la inscripción. Inténtalo de nuevo.'
    );
  });

  it('traduce el formulario y los errores al inglés', async () => {
    await i18n.changeLanguage('en');
    const user = userEvent.setup();
    setup(vi.fn().mockRejectedValue(new RegistrationError('workshopFull')));
    await user.type(screen.getByLabelText(/your name/i), 'Ana');
    await user.type(screen.getByLabelText(/your email/i), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: /join the workshop/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The workshop is full: no spots left.'
    );
  });
});
