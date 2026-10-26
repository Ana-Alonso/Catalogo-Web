import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../design-system/utils/cn';

const headerVariants = cva('w-full top-0 z-50 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800',
      transparent: 'bg-transparent',
      solid: 'bg-neutral-950 border-b border-neutral-800',
    },
    position: {
      sticky: 'sticky',
      fixed: 'fixed left-0 right-0',
    },
    elevated: {
      true: 'shadow-lg shadow-black/50',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'sticky',
    elevated: false,
  },
});

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, variant, position, elevated, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ variant, position, elevated }), className)}
        {...props}
      >
        {children}
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;
