import React, { type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Typography } from '../ui/Typography';
import { useTranslation } from 'react-i18next';
import { useNoindex } from '../../hooks/useNoindex';
import { logError } from '../../utils/logger';
import { theme } from '../../theme';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export const ErrorFallback: React.FC = () => {
  useNoindex();
  const { t } = useTranslation();

  return (
    <main
      role="alert"
      className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4"
    >
      <div className="max-w-xl text-center">
        <AlertTriangle
          className="w-10 h-10 text-orange-500 mx-auto"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-wide uppercase">
          {t('errors.boundary.title')}
        </h1>
        <Typography variant="body" className={`${theme.colors.textMuted} mt-4 text-base`}>
          {t('errors.boundary.description')}
        </Typography>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`inline-flex mt-8 items-center justify-center gap-2 rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest ${theme.colors.primary} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          {t('common.reload')}
        </button>
      </div>
    </main>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError('ErrorBoundary', error);
    logError('ErrorBoundary.componentStack', info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return <ErrorFallback />;
  }
}

export default ErrorBoundary;
