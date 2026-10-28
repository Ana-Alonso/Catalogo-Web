import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Image, Typography } from '../../ui';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductIdentityProps {
  item: CatalogItem;
  isImageLazy?: boolean;
}

export const AdminProductIdentity: React.FC<AdminProductIdentityProps> = ({
  item,
  isImageLazy,
}) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" align="center" gap="tight" minWidth="zero">
      <Image
        src={item.image}
        alt=""
        width={12}
        height={12}
        rounded="md"
        background="strong"
        shrink={false}
        loading={isImageLazy ? 'lazy' : undefined}
      />
      <Box minWidth="zero">
        <Box display="flex" wrap align="center" gap="xs">
          <Typography
            size="sm"
            tone="main"
            weight="semibold"
            clamp={1}
            title={item.title}
          >
            {item.title}
          </Typography>
          {item.source === 'etsy' && (
            <Badge variant="neutral">{t('admin.productTable.etsy')}</Badge>
          )}
          {item.isVisible === false && (
            <Badge variant="outline">{t('admin.productTable.hidden')}</Badge>
          )}
        </Box>
        <Typography variant="body" size="xs" clamp={1} maxWidth="xs">
          {item.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminProductIdentity;
