import React from 'react';
import { Box, Card } from '../../ui';
import { Skeleton } from '../../ui/Skeleton';

const SKELETON_ROWS = 5;

export const AdminProductTableSkeleton: React.FC = () => {
  return (
    <Card aria-hidden="true">
      <Box padding="lg" divider="bottom" display="flex" direction="column" gap="sm">
        <Skeleton height={6} width={64} />
        <Skeleton height={4} width={80} maxWidth="full" />
      </Box>
      <Box divide="neutral">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Box key={index} padding="lg" display="flex" align="center" gap="md">
            <Skeleton width={12} height={12} shrink={false} />
            <Box flex display="flex" direction="column" gap="xs">
              <Skeleton height={4} width="1/3" />
              <Skeleton height={3} width="1/2" />
            </Box>
            <Skeleton height={6} width={24} rounded="full" />
            <Skeleton height={6} width={20} rounded="full" />
            <Skeleton height={8} width={16} />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default AdminProductTableSkeleton;
