import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { Box, CalendarEventActions, Icon, Typography } from '../ui';
import { parsePriceToCents } from '../../utils/price';
import type { CatalogItem, ProductFormData } from '../../types/catalog';

interface AdminWorkshopCalendarPanelProps {
  workshopData: ProductFormData;
}

const buildWorkshopItem = (data: ProductFormData): CatalogItem => ({
  id: 'draft',
  title: data.title,
  description: data.description,
  image: '',
  category: 'talleres',
  status: data.status,
  eventDate: data.eventDate,
  eventLocation: data.eventLocation,
  priceCents: parsePriceToCents(data.price),
  currency: 'EUR',
});

export const AdminWorkshopCalendarPanel: React.FC<AdminWorkshopCalendarPanelProps> = ({
  workshopData,
}) => {
  const { t } = useTranslation();
  const workshop = useMemo(() => buildWorkshopItem(workshopData), [workshopData]);

  return (
    <Box
      padding="md"
      rounded="xl"
      background="subtle"
      border
      borderTone="strong"
      display="flex"
      direction="column"
      gap="tight"
    >
      <Box display="flex" align="center" gap="tight">
        <Icon as={CheckCircle} size="lg" tone="success" shrink={false} />
        <Typography variant="body" size="sm" tone="soft">
          {t('admin.calendarPanel.published', { title: workshop.title })}
        </Typography>
      </Box>
      <CalendarEventActions workshop={workshop} />
    </Box>
  );
};

export default AdminWorkshopCalendarPanel;
