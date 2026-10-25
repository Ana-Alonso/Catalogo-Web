import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { CalendarEventActions } from '../ui';
import { Typography } from '../ui';
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
    <div className="p-4 rounded-xl border bg-neutral-900/60 border-neutral-700 space-y-3">
      <Typography variant="body" className="text-sm text-neutral-200 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" aria-hidden="true" />
        <span>{t('admin.calendarPanel.published', { title: workshop.title })}</span>
      </Typography>
      <CalendarEventActions workshop={workshop} />
    </div>
  );
};

export default AdminWorkshopCalendarPanel;
