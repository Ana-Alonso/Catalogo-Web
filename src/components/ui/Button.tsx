import React from 'react';
import { cn } from '../../design-system/utils/cn';
import { MARGIN, type MarginToken } from './styles';

const variantStyles = {
  primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 focus-visible:ring-white',
  secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 focus-visible:ring-orange-600',
  outline: 'bg-transparent border border-neutral-700 hover:border-white text-white focus-visible:ring-orange-600',
  ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white focus-visible:ring-orange-600',
  accent: 'bg-transparent border border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white focus-visible:ring-orange-600',
  danger: 'bg-red-600/10 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white focus-visible:ring-red-500',
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-xs',
  card: 'px-4 py-3 text-sm',
  cta: 'px-6 py-3 text-xs font-bold tracking-widest',
  lg: 'px-8 py-4 text-sm font-bold tracking-widest',
} as const;

interface ButtonAppearance {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  fullWidth?: boolean;
  marginTop?: MarginToken;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonProps =
  | (ButtonAppearance &
      React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (ButtonAppearance & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

export const Button = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    marginTop,
    className,
    children,
  } = props;

  const classes = cn(
    'group inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    marginTop && MARGIN[marginTop].mt,
    className
  );

  if (props.href !== undefined) {
    const { variant: _variant, size: _size, fullWidth: _fullWidth, marginTop: _marginTop, className: _className, children: _children, ...anchorProps } = props;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { variant: _variant, size: _size, fullWidth: _fullWidth, marginTop: _marginTop, className: _className, children: _children, type = 'button', ...buttonProps } = props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
};

export default Button;
