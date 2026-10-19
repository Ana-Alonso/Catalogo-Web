import React, { type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'border rounded-xl overflow-hidden',
          variant === 'default' && 'bg-neutral-900 border-neutral-800',
          variant === 'subtle' && 'bg-neutral-950/60 border-neutral-800/60',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
