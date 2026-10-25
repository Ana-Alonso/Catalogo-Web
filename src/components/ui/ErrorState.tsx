import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Typography } from './Typography';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { Card } from './Card';
import { theme } from '../../theme';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry,
  retryLabel,
  className,
}) => {
  return (
    <Card
      role="alert"
      className={twMerge(
        clsx('p-8 text-center flex flex-col items-center gap-4', className)
      )}
    >
      <AlertTriangle className="w-8 h-8 text-orange-500" aria-hidden="true" />
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <Typography variant="body" className={`${theme.colors.textMuted} text-sm max-w-md mx-auto`}>
          {description}
        </Typography>
      </div>
      {onRetry && retryLabel && (
        <Button variant="outline" onClick={() => void onRetry()}>
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </Card>
  );
};

export default ErrorState;
