import React, { type HTMLAttributes, type ElementType } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'caption'
  | 'subtitle';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
}

const defaultVariantElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
  subtitle: 'p',
};

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none',
  h2: 'text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider',
  h3: 'text-xl font-bold text-white uppercase tracking-wider',
  h4: 'text-lg font-bold text-white',
  body: 'text-neutral-400 text-sm leading-relaxed',
  subtitle: 'text-lg sm:text-xl text-neutral-400 font-light',
  caption: 'text-xs uppercase tracking-wider font-semibold',
};

export const Typography: React.FC<TypographyProps> = ({
  as,
  variant = 'body',
  className,
  children,
  ...props
}) => {
  const Component = as || defaultVariantElements[variant];

  return (
    <Component
      className={twMerge(clsx(variantStyles[variant], className))}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
