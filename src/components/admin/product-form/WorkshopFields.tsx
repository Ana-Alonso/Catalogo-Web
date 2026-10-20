import React from 'react';
import { Box, Input } from '../../ui';
import { theme } from '../../../theme';

interface WorkshopFieldsProps {
  eventDate: string;
  eventLocation: string;
  cupo: string;
  onEventDateChange: (value: string) => void;
  onEventLocationChange: (value: string) => void;
  onCupoChange: (value: string) => void;
}

export const WorkshopFields: React.FC<WorkshopFieldsProps> = ({
  eventDate,
  eventLocation,
  cupo,
  onEventDateChange,
  onEventLocationChange,
  onCupoChange,
}) => {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-neutral-950 border border-neutral-800">
      <Box>
        <label htmlFor="prod-event-date" className={theme.inputs.label}>
          Fecha y Hora del Taller
        </label>
        <input
          id="prod-event-date"
          type="datetime-local"
          value={eventDate}
          onChange={(event) => onEventDateChange(event.target.value)}
          className={theme.inputs.base}
        />
      </Box>
      <Input
        id="prod-event-loc"
        label="Lugar o Modalidad"
        maxLength={120}
        value={eventLocation}
        onChange={(event) => onEventLocationChange(event.target.value)}
        placeholder="Ej: Presencial (Madrid) u Online"
      />
      <Box>
        <label htmlFor="prod-cupo" className={theme.inputs.label}>
          Cupo (opcional)
        </label>
        <input
          id="prod-cupo"
          type="number"
          min={1}
          step={1}
          value={cupo}
          onChange={(event) => onCupoChange(event.target.value)}
          className={theme.inputs.base}
          placeholder="Sin límite"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Deja vacío para inscripciones sin límite.
        </p>
      </Box>
    </Box>
  );
};

export default WorkshopFields;
