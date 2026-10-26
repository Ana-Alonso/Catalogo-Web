import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { theme } from '../../theme';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className={`${theme.colors.surface}/90 rounded-lg overflow-hidden border ${theme.colors.border}`}
    >
      <Skeleton className="aspect-square w-full" rounded="none" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
