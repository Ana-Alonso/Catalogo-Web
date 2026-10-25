import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Typography } from './Typography';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, endAdornment, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={twMerge(
              clsx(
                'w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-600 text-sm transition-colors',
                error && 'border-red-500 focus:border-red-500',
                endAdornment && 'pr-12',
                className
              )
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              {endAdornment}
            </div>
          )}
        </div>
        {error && <Typography variant="body" className="mt-1 text-xs text-red-400">{error}</Typography>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
