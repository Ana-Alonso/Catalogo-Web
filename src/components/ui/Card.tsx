import React, { type HTMLAttributes } from 'react';
import { cn } from '../../design-system/utils/cn';
import { PADDING, type PaddingToken } from './styles';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle';
  padding?: PaddingToken;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'border rounded-xl overflow-hidden',
        variant === 'default' && 'bg-neutral-900 border-neutral-800',
        variant === 'subtle' && 'bg-neutral-950/60 border-neutral-800/60',
        padding && PADDING[padding].p,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
