import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Download, Globe } from 'lucide-react';
import { Button, Box, Typography } from './index';
import {
  parseWorkshopDate,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  buildWorkshopIcs,
  buildIcsFilename,
  downloadIcsFile,
} from '../../utils/calendar';
import { normalizeLanguage } from '../../i18n/languages';
import type { CatalogItem } from '../../types/catalog';

interface CalendarEventActionsProps {
  workshop: CatalogItem;
  attendee?: { name: string; email: string };
  className?: string;
}

const linkClassName =
  'w-full inline-flex justify-center items-center gap-2 bg-transparent border border-neutral-700 hover:border-white text-neutral-300 hover:text-white font-semibold uppercase tracking-wider text-xs py-2.5 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950';

export const CalendarEventActions: React.FC<CalendarEventActionsProps> = ({
  workshop,
  attendee,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const eventDate = parseWorkshopDate(workshop.eventDate);

  if (!eventDate) {
    return null;
  }

  const labels = {
    language: normalizeLanguage(i18n.resolvedLanguage ?? i18n.language),
    priceLabel: t('calendar.priceLabel'),
    filenameFallback: t('calendar.filenameFallback'),
  };

  const googleUrl = getGoogleCalendarUrl(workshop, labels);
  const outlookUrl = getOutlookCalendarUrl(workshop, labels);

  const handleDownload = () => {
    downloadIcsFile(
      buildIcsFilename(workshop.title, labels.filenameFallback),
      buildWorkshopIcs(workshop, attendee, labels)
    );
  };

  return (
    <Box className={className}>
      <Typography variant="body" className="text-xs uppercase font-semibold tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
        <Calendar className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
        {t('calendar.heading')}
      </Typography>
      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          aria-label={t('calendar.googleAria', { title: workshop.title })}
        >
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          Google
        </a>
        <a
          href={outlookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          aria-label={t('calendar.outlookAria', { title: workshop.title })}
        >
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          Outlook
        </a>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full uppercase"
          onClick={handleDownload}
          aria-label={t('calendar.downloadAria', { title: workshop.title })}
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          .ics
        </Button>
      </div>
    </Box>
  );
};

export default CalendarEventActions;
