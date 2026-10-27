import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '../ui';

const CLAMP_LINES = 3;
const EXPAND_MIN_CHARS = 220;

interface ProductDescriptionProps {
  id: string;
  text: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ id, text }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = text.trim().length > EXPAND_MIN_CHARS;

  return (
    <Box id={id} display="flex" direction="column" gap="xs" marginBottom="lg" grow>
      <Typography variant="body" clamp={canExpand && !isExpanded ? CLAMP_LINES : undefined}>
        {text}
      </Typography>
      {canExpand && (
        <Box display="flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
            aria-controls={id}
          >
            {t(isExpanded ? 'product.readLess' : 'product.readMore')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductDescription;
