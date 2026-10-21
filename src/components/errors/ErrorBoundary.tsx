import React, { type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import i18n from '../../i18n';
import { useNoindex } from '../../hooks/useNoindex';
import { logError } from '../../utils/logger';
import { theme } from '../../theme';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const NoindexMeta: React.FC = () => {
  useNoindex();
  return null;
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

    return (
      <main
        role="alert"
        className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4"
      >
        <NoindexMeta />
        <div className="max-w-xl text-center">
          <AlertTriangle
            className="w-10 h-10 text-orange-500 mx-auto"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-3xl font-bold tracking-wide uppercase">
            {i18n.t('errors.boundary.title')}
          </h1>
          <p className={`${theme.colors.textMuted} mt-4 text-base`}>
            {i18n.t('errors.boundary.description')}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`inline-flex mt-8 items-center justify-center gap-2 rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest ${theme.colors.primary} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            {i18n.t('common.reload')}
          </button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
