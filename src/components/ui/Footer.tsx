import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../design-system/utils/cn';

const footerVariants = cva('w-full', {
  variants: {
    variant: {
      main: 'bg-neutral-950 border-t border-neutral-800',
      minimal: 'bg-transparent',
      dark: 'bg-neutral-950',
    },
    padding: {
      none: 'py-0',
      sm: 'py-6',
      md: 'py-12',
      lg: 'py-16',
    },
    container: {
      true: 'px-4 sm:px-6 lg:px-8',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'main',
    padding: 'md',
    container: true,
  },
});

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, variant, padding, container, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(footerVariants({ variant, padding, container }), className)}
        {...props}
      >
        {children}
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
