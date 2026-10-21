import React from 'react';
import { Skeleton } from '../ui/Skeleton';

const SKELETON_ROWS = 3;

export const AdminRegistrationsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-hidden="true">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-28" rounded="full" />
          </div>
          <div className="rounded-lg border border-neutral-800 divide-y divide-neutral-800">
            {Array.from({ length: 2 }, (_row, rowIndex) => (
              <div
                key={rowIndex}
                className="p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56 max-w-full" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRegistrationsSkeleton;
