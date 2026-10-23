import React, { type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SkeletonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: SkeletonRounded;
}

const roundedStyles: Record<SkeletonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'md',
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx('animate-pulse bg-neutral-800/80', roundedStyles[rounded], className)
      )}
      {...props}
    />
  );
};

export default Skeleton;
