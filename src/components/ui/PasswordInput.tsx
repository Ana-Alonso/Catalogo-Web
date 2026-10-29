import { useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'type' | 'endAdornment'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    return (
      <Input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        className={className}
        endAdornment={
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? t('a11y.hidePassword') : t('a11y.showPassword')}
            className="p-1.5 text-neutral-400 hover:text-orange-400 focus:outline-none focus-visible:text-orange-400 rounded transition-colors"
          >
            {isVisible ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
