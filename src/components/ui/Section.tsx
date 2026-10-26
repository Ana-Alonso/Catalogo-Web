import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../design-system/utils/cn';
import { MIN_HEIGHT } from './styles';

const sectionVariants = cva('w-full', {
  variants: {
    paddingY: {
      none: 'py-0',
      xs: 'py-4 md:py-6',
      sm: 'py-6 md:py-8',
      md: 'py-10 md:py-14',
      lg: 'py-12 md:py-16',
      xl: 'py-16 md:py-24',
    },
    background: {
      none: '',
      neutral: 'bg-neutral-950',
      surface: 'bg-neutral-900',
      subtle: 'bg-neutral-950/60',
    },
    overflow: {
      visible: 'overflow-visible',
      hidden: 'overflow-hidden',
    },
  },
  defaultVariants: {
    paddingY: 'lg',
    background: 'neutral',
    overflow: 'hidden',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
  minHeight?: keyof typeof MIN_HEIGHT;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, paddingY, background, overflow, minHeight, as: Component = 'section', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          sectionVariants({ paddingY, background, overflow }),
          minHeight && MIN_HEIGHT[minHeight],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Section.displayName = 'Section';

export default Section;
