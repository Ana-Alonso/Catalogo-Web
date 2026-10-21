import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const ThrowingComponent = (): never => {
  throw new Error('Fallo de prueba');
};

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('captura un error de renderizado y muestra la pantalla de fallback', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByRole('heading', { name: 'Algo ha salido mal' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Recargar página' })
    ).toBeInTheDocument();
  });
});
