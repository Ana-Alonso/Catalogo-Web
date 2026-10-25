import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../design-system/utils/cn';

const headerVariants = cva('w-full sticky top-0 z-50', {
  variants: {
    variant: {
      default: 'bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800',
      transparent: 'bg-transparent',
      solid: 'bg-neutral-950 border-b border-neutral-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ variant }), className)}
        {...props}
      >
        {children}
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;
