import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { theme } from '../../theme';

const SKELETON_ROWS = 5;

export const AdminProductTableSkeleton: React.FC = () => {
  return (
    <Card aria-hidden="true">
      <div className={`p-6 border-b ${theme.colors.border} space-y-2`}>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="divide-y divide-neutral-800">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div key={index} className="p-6 flex items-center gap-4">
            <Skeleton className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-24" rounded="full" />
            <Skeleton className="h-6 w-20" rounded="full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AdminProductTableSkeleton;
