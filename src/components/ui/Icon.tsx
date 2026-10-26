import React from 'react';
import { cn } from '../../design-system/utils/cn';
import { MARGIN, TONE, type MarginToken, type ToneToken } from './styles';

export type IconGlyphProps = { className?: string; 'aria-hidden'?: 'true' };

const ICON_SIZE = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  '2xl': 'w-8 h-8',
  '3xl': 'w-10 h-10',
} as const;

export interface IconProps {
  as: React.ComponentType<IconGlyphProps>;
  size?: keyof typeof ICON_SIZE;
  tone?: ToneToken;
  spin?: boolean;
  shrink?: boolean;
  center?: boolean;
  hoverTranslate?: boolean;
  hoverTone?: 'primary';
  marginTop?: MarginToken;
  marginBottom?: MarginToken;
  marginRight?: MarginToken;
}

export const Icon: React.FC<IconProps> = ({
  as: Component,
  size = 'md',
  tone,
  spin,
  shrink,
  center,
  hoverTranslate,
  hoverTone,
  marginTop,
  marginBottom,
  marginRight,
}) => (
  <Component
    aria-hidden="true"
    className={cn(
      ICON_SIZE[size],
      tone && TONE[tone],
      spin === true && 'animate-spin',
      shrink === false && 'flex-shrink-0',
      center === true && 'mx-auto',
      hoverTranslate === true && 'transition-transform group-hover:translate-x-1',
      hoverTone === 'primary' && 'group-hover:text-orange-600',
      marginTop && MARGIN[marginTop].mt,
      marginBottom && MARGIN[marginBottom].mb,
      marginRight && MARGIN[marginRight].mr
    )}
  />
);

Icon.displayName = 'Icon';

export default Icon;
