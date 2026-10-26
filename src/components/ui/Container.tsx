import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../design-system/utils/cn';
import {
  ALIGN,
  DIRECTION,
  DISPLAY,
  GAP,
  HEIGHT,
  JUSTIFY,
  PADDING,
  POSITION,
  TEXT_ALIGN,
  Z_INDEX,
  type PaddingToken,
} from './styles';

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1400px]',
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-4 sm:px-6 lg:px-8',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'lg',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType;
  position?: keyof typeof POSITION;
  zIndex?: keyof typeof Z_INDEX;
  textAlign?: keyof typeof TEXT_ALIGN;
  display?: keyof typeof DISPLAY;
  direction?: keyof typeof DIRECTION;
  align?: keyof typeof ALIGN;
  justify?: keyof typeof JUSTIFY;
  gap?: keyof typeof GAP;
  height?: keyof typeof HEIGHT;
  paddingY?: PaddingToken;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, position, zIndex, textAlign, display, direction, align, justify, gap, height, paddingY, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          containerVariants({ size, padding }),
          position && POSITION[position],
          zIndex !== undefined && Z_INDEX[zIndex],
          textAlign && TEXT_ALIGN[textAlign],
          display && DISPLAY[display],
          direction && DIRECTION[direction],
          align && ALIGN[align],
          justify && JUSTIFY[justify],
          gap && GAP[gap],
          height && HEIGHT[height],
          paddingY && PADDING[paddingY].py,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

export default Container;
