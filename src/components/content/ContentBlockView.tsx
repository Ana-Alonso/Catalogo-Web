import React from 'react';
import type { ContentBlock } from '../../data/content/types';
import { Box, Typography } from '../ui';

// Tipografía de cuerpo del sitio para el texto largo (páginas legales y FAQ).
export const ContentBlockView: React.FC<{ block: ContentBlock }> = ({ block }) => {
  if (block.kind === 'list') {
    return (
      <Box as="ul" className="list-disc space-y-1 pl-5">
        {block.items.map((item) => (
          <Box as="li" key={item}>
            <Typography variant="body" size="sm">
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Typography variant="body" size="sm">
      {block.text}
    </Typography>
  );
};

export default ContentBlockView;
