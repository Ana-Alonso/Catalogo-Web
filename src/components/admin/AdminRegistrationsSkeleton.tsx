import React from 'react';
import { Box } from '../ui';
import { Skeleton } from '../ui/Skeleton';

const SKELETON_ROWS = 3;

export const AdminRegistrationsSkeleton: React.FC = () => {
  return (
    <Box display="flex" direction="column" gap="lg" aria-hidden="true">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Box key={index} display="flex" direction="column" gap="tight">
          <Box display="flex" align="center" justify="between" gap="tight">
            <Skeleton height={5} width={48} />
            <Skeleton height={6} width={28} rounded="full" />
          </Box>
          <Box rounded="lg" border divide="neutral">
            {Array.from({ length: 2 }, (_row, rowIndex) => (
              <Box
                key={rowIndex}
                padding="md"
                display="flex"
                wrap
                align="center"
                justify="between"
                gap="tight"
              >
                <Box display="flex" direction="column" gap="sm">
                  <Skeleton height={4} width={40} />
                  <Skeleton height={3} width={56} maxWidth="full" />
                </Box>
                <Skeleton height={8} width={32} />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AdminRegistrationsSkeleton;
