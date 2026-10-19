import React, { type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 focus-visible:ring-white',
  secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 focus-visible:ring-orange-600',
  outline: 'bg-transparent border border-neutral-700 hover:border-white text-white focus-visible:ring-orange-600',
  ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white focus-visible:ring-orange-600',
  danger: 'bg-red-600/10 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white focus-visible:ring-red-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-8 py-4 text-sm font-bold tracking-widest',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
