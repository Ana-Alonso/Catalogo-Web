import React, { type HTMLAttributes } from 'react';
import { cn } from '../../design-system/utils/cn';
import { ASPECT, HEIGHT, MAX_WIDTH, ROUNDED, WIDTH } from './styles';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: keyof typeof ROUNDED;
  width?: keyof typeof WIDTH;
  height?: keyof typeof HEIGHT;
  maxWidth?: keyof typeof MAX_WIDTH;
  shrink?: boolean;
  aspect?: keyof typeof ASPECT;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'md',
  width,
  height,
  maxWidth,
  shrink,
  aspect,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-neutral-800/80',
        ROUNDED[rounded],
        width && WIDTH[width],
        height && HEIGHT[height],
        maxWidth && MAX_WIDTH[maxWidth],
        shrink === false && 'flex-shrink-0',
        aspect && ASPECT[aspect],
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
