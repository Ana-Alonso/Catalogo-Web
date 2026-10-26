import React, { type HTMLAttributes, type ElementType } from 'react';
import { cn } from '../../design-system/utils/cn';
import {
  CLAMP,
  DISPLAY,
  HIDE_BELOW,
  MARGIN,
  MAX_WIDTH,
  TEXT_ALIGN,
  TEXT_SIZE,
  TONE,
  TRACKING,
  TRANSFORM_TEXT,
  WEIGHT,
  type DisplayToken,
  type MarginToken,
} from './styles';

export type TypographyVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'caption'
  | 'subtitle'
  | 'plain';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
  align?: keyof typeof TEXT_ALIGN;
  tone?: keyof typeof TONE;
  size?: keyof typeof TEXT_SIZE;
  display?: DisplayToken;
  hideBelow?: keyof typeof HIDE_BELOW;
  marginTop?: MarginToken;
  marginBottom?: MarginToken;
  marginLeft?: MarginToken;
  maxWidth?: keyof typeof MAX_WIDTH;
  center?: boolean;
  grow?: boolean;
  truncate?: boolean;
  clamp?: keyof typeof CLAMP;
  strike?: boolean;
  icon?: boolean;
  tracking?: keyof typeof TRACKING;
  weight?: keyof typeof WEIGHT;
  transform?: keyof typeof TRANSFORM_TEXT;
}

const defaultVariantElements: Record<TypographyVariant, ElementType> = {
  hero: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
  subtitle: 'p',
  plain: 'span',
};

const variantStyles: Record<TypographyVariant, string> = {
  hero: 'font-hero text-5xl sm:text-7xl md:text-8xl font-bold text-white uppercase tracking-normal leading-none',
  h1: 'text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none',
  h2: 'text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider',
  h3: 'text-xl font-bold text-white uppercase tracking-wider',
  h4: 'text-lg font-bold text-white',
  body: 'text-neutral-400 text-sm leading-relaxed',
  subtitle: 'text-lg sm:text-xl text-neutral-400 font-light',
  caption: 'text-xs uppercase tracking-wider font-semibold',
  plain: '',
};

export const Typography: React.FC<TypographyProps> = ({
  as,
  variant = 'body',
  align,
  tone,
  size,
  display,
  hideBelow,
  marginTop,
  marginBottom,
  marginLeft,
  maxWidth,
  center,
  grow,
  truncate,
  clamp,
  strike,
  icon,
  tracking,
  weight,
  transform,
  className,
  children,
  ...props
}) => {
  const Component = as || defaultVariantElements[variant];

  return (
    <Component
      className={cn(
        variantStyles[variant],
        size && TEXT_SIZE[size],
        tone && TONE[tone],
        align && TEXT_ALIGN[align],
        maxWidth && MAX_WIDTH[maxWidth],
        center && 'mx-auto',
        grow === true && 'flex-grow',
        truncate && 'truncate',
        clamp && CLAMP[clamp],
        strike === true && 'line-through',
        icon === true && 'inline-flex items-center gap-1',
        tracking && TRACKING[tracking],
        weight && WEIGHT[weight],
        transform && TRANSFORM_TEXT[transform],
        marginTop && MARGIN[marginTop].mt,
        marginBottom && MARGIN[marginBottom].mb,
        marginLeft && MARGIN[marginLeft].ml,
        display && DISPLAY[display],
        hideBelow && HIDE_BELOW[hideBelow][display ?? 'block'],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
