import React, { type HTMLAttributes } from 'react';
import { cn } from '../../design-system/utils/cn';
import { MARGIN, type MarginToken } from './styles';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'neutral' | 'outline' | 'solid' | 'glass';
  size?: 'micro';
  fit?: boolean;
  marginTop?: MarginToken;
  marginBottom?: MarginToken;
}

const variantStyles = {
  primary: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  outline: 'bg-transparent text-neutral-400 border-neutral-800',
  solid: 'bg-orange-600 text-white border-0 font-bold text-[10px] shadow-md',
  glass:
    'bg-neutral-950/80 backdrop-blur-sm border-neutral-700 text-orange-400 font-bold rounded-sm',
};

const sizeStyles = {
  micro: 'text-[10px] px-2 py-0.5 rounded-sm tracking-wider',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size,
  fit,
  marginTop,
  marginBottom,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs rounded uppercase font-semibold border',
        variantStyles[variant],
        size && sizeStyles[size],
        fit === true && 'w-fit self-start',
        marginTop && MARGIN[marginTop].mt,
        marginBottom && MARGIN[marginBottom].mb,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
