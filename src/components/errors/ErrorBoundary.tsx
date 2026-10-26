import React, { type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNoindex } from '../../hooks/useNoindex';
import { logError } from '../../utils/logger';
import { Box, Button, Icon, Typography } from '../ui';

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
    <Box
      as="main"
      role="alert"
      minHeight="screen"
      background="neutral"
      tone="bright"
      display="flex"
      align="center"
      justify="center"
      paddingX="md"
    >
      <Box maxWidth="xl" textAlign="center">
        <Icon as={AlertTriangle} size="3xl" tone="accent" center />
        <Typography
          as="h1"
          variant="plain"
          marginTop="md"
          size="3xl"
          weight="bold"
          tracking="wide"
          transform="uppercase"
        >
          {t('errors.boundary.title')}
        </Typography>
        <Typography variant="body" size="base" tone="muted" marginTop="md">
          {t('errors.boundary.description')}
        </Typography>
        <Button
          variant="primary"
          size="cta"
          marginTop="xl"
          onClick={() => window.location.reload()}
        >
          <Icon as={RefreshCw} />
          {t('common.reload')}
        </Button>
      </Box>
    </Box>
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
