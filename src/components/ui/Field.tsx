import { forwardRef, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, labelFor, className, id, children, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={labelFor ?? id} className={FIELD_LABEL}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={twMerge(clsx(FIELD_BASE, className))}
        {...props}
      >
        {children}
      </select>
    </div>
  )
);

Select.displayName = 'Select';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelFor?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, labelFor, className, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={labelFor ?? id} className={FIELD_LABEL}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={twMerge(clsx(FIELD_BASE, className))}
        {...props}
      />
    </div>
  )
);

Textarea.displayName = 'Textarea';

export interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled,
}) => (
  <div className="flex items-center gap-2">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="w-4 h-4 accent-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600 cursor-pointer"
    />
    <label
      htmlFor={id}
      className="text-xs uppercase font-semibold text-neutral-300 cursor-pointer"
    >
      {label}
    </label>
  </div>
);

Checkbox.displayName = 'Checkbox';
