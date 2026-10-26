import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input, Typography } from '../../ui';

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
  const { t } = useTranslation();

  return (
    <Box
      display="grid"
      columns="1"
      columnsMd="3"
      gap="lg"
      padding="md"
      rounded="lg"
      background="neutral"
      border
    >
      <Input
        id="prod-event-date"
        label={t('admin.workshopFields.dateLabel')}
        type="datetime-local"
        value={eventDate}
        onChange={(event) => onEventDateChange(event.target.value)}
      />
      <Input
        id="prod-event-loc"
        label={t('admin.workshopFields.locationLabel')}
        maxLength={120}
        value={eventLocation}
        onChange={(event) => onEventLocationChange(event.target.value)}
        placeholder={t('admin.workshopFields.locationPlaceholder')}
      />
      <Box>
        <Input
          id="prod-cupo"
          label={t('admin.workshopFields.capacityLabel')}
          type="number"
          min={1}
          step={1}
          value={cupo}
          onChange={(event) => onCupoChange(event.target.value)}
          placeholder={t('admin.workshopFields.capacityPlaceholder')}
        />
        <Typography variant="body" tone="subtle" size="xs" marginTop="xs">
          {t('admin.workshopFields.capacityHint')}
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkshopFields;
