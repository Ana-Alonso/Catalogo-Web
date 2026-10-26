import React from 'react';
import { Box, Card, Skeleton } from '../ui';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card>
      <Skeleton aspect="square" width="full" rounded="none" />
      <Box padding="lg" display="flex" direction="column" gap="md">
        <Box display="flex" align="center" gap="sm">
          <Skeleton height={5} width={24} rounded="full" />
          <Skeleton height={5} width={20} rounded="full" />
        </Box>
        <Skeleton height={6} width="3/4" />
        <Box display="flex" direction="column" gap="xs">
          <Skeleton height={4} width="full" />
          <Skeleton height={4} width="5/6" />
          <Skeleton height={4} width="2/3" />
        </Box>
        <Skeleton height={11} width="full" />
      </Box>
    </Card>
  );
};

export default ProductCardSkeleton;
