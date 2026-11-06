import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkshopFields } from '../WorkshopFields';

const props = {
  eventDate: '',
  eventLocation: '',
  cupo: '',
  registrationDeadline: '',
  onEventDateChange: vi.fn(),
  onEventLocationChange: vi.fn(),
  onCupoChange: vi.fn(),
  onRegistrationDeadlineChange: vi.fn(),
};

describe('WorkshopFields', () => {
  it('muestra fecha y lugar para talleres', () => {
    render(<WorkshopFields category="talleres" {...props} />);

    expect(screen.getByLabelText('Fecha y Hora del Taller')).toBeInTheDocument();
    expect(screen.getByLabelText('Lugar o Modalidad')).toBeInTheDocument();
  });

  it('solo muestra unidades y plazo para especiales', () => {
    render(<WorkshopFields category="especiales" {...props} />);

    expect(screen.queryByLabelText('Fecha y Hora del Taller')).toBeNull();
    expect(screen.queryByLabelText('Lugar o Modalidad')).toBeNull();
    expect(screen.getByLabelText('Unidades disponibles (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Deja vacío para aceptar reservas sin límite de unidades.')).toBeInTheDocument();
    expect(screen.getByLabelText('Plazo para reservar (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Deja vacío para no establecer plazo de cierre; las reservas permanecen abiertas.')).toBeInTheDocument();
  });
});
