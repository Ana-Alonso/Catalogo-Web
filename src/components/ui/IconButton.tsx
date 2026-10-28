import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../design-system/utils/cn';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
  {
    variants: {
      variant: {
        default: 'bg-neutral-900/80 border border-neutral-700 text-white hover:border-orange-600 hover:text-orange-500',
        ghost: 'bg-transparent text-neutral-400 hover:text-white',
        subtle: 'bg-neutral-900/60 text-neutral-300 hover:text-white hover:bg-neutral-900',
        overlay:
          'bg-neutral-950/90 hover:bg-neutral-950 text-white shadow-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
      },
      size: {
        sm: 'min-h-11 min-w-11 p-1.5 md:min-h-0 md:min-w-0',
        md: 'min-h-11 min-w-11 p-2 md:min-h-0 md:min-w-0',
        lg: 'min-h-11 min-w-11 p-2.5 md:min-h-0 md:min-w-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, children, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
