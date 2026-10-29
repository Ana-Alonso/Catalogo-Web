import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Typography } from './Typography';

export const FIELD_BASE =
  'w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-600 text-sm transition-colors';

export const FIELD_LABEL =
  'block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2';

export interface FieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className={FIELD_LABEL}>
    {children}
  </label>
);

FieldLabel.displayName = 'FieldLabel';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelFor?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, labelFor, error, className, id, children, ...props }, ref) => {
    const errorId = useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={labelFor ?? id} className={FIELD_LABEL}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={twMerge(
            clsx(FIELD_BASE, error && 'border-red-500 focus:border-red-500', className)
          )}
          {...props}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          {children}
        </select>
        {error && (
          <Typography id={errorId} variant="body" className="mt-1 text-xs text-red-400">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelFor?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, labelFor, error, className, id, ...props }, ref) => {
    const errorId = useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={labelFor ?? id} className={FIELD_LABEL}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={twMerge(
            clsx(FIELD_BASE, error && 'border-red-500 focus:border-red-500', className)
          )}
          {...props}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {error && (
          <Typography id={errorId} variant="body" className="mt-1 text-xs text-red-400">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled,
  error,
}) => {
  const errorId = useId();
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className={twMerge(
            clsx(
              'w-4 h-4 accent-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600 cursor-pointer',
              error && 'ring-1 ring-red-500'
            )
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <label
          htmlFor={id}
          className="text-xs uppercase font-semibold text-neutral-300 cursor-pointer"
        >
          {label}
        </label>
      </div>
      {error && (
        <Typography
          id={errorId}
          role="alert"
          variant="body"
          className="mt-1 text-xs text-red-400"
        >
          {error}
        </Typography>
      )}
    </div>
  );
};

Checkbox.displayName = 'Checkbox';
