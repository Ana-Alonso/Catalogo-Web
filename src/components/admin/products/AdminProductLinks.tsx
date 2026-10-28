import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Box, Icon, TextLink } from '../../ui';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductLinksProps {
  item: CatalogItem;
  isTouch?: boolean;
}

const TOUCH_LINK = 'min-h-11';

export const AdminProductLinks: React.FC<AdminProductLinksProps> = ({
  item,
  isTouch,
}) => {
  if (item.category === 'talleres') return null;

  const linkClassName = isTouch ? TOUCH_LINK : undefined;

  return (
    <Box display="flex" wrap align="center" gap="tight">
      {item.etsyLink && (
        <TextLink
          href={item.etsyLink}
          target="_blank"
          rel="noopener noreferrer"
          size="xs"
          hover="underline"
          className={linkClassName}
        >
          Etsy <Icon as={ExternalLink} size="xs" />
        </TextLink>
      )}
      {item.vintedLink && (
        <TextLink
          href={item.vintedLink}
          target="_blank"
          rel="noopener noreferrer"
          tone="muted"
          size="xs"
          hover="bright"
          className={linkClassName}
        >
          Vinted <Icon as={ExternalLink} size="xs" />
        </TextLink>
      )}
    </Box>
  );
};

export default AdminProductLinks;
