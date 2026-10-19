import React, { type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'neutral' | 'outline';
}

const variantStyles = {
  primary: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  outline: 'bg-transparent text-neutral-400 border-neutral-800',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-1 text-xs rounded uppercase font-semibold border',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
