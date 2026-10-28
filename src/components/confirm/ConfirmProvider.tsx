import React, { useCallback, useRef, useState } from 'react';
import { ConfirmContext } from './ConfirmContext';
import { ConfirmDialog } from './ConfirmDialog';
import type { ConfirmFn, ConfirmRequest } from '../../types/confirm';

interface ConfirmProviderProps {
  children: React.ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const resolverRef = useRef<((isConfirmed: boolean) => void) | null>(null);

  const settle = useCallback((isConfirmed: boolean): void => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setRequest(null);
    resolve?.(isConfirmed);
  }, []);

  const confirm = useCallback<ConfirmFn>((nextRequest) => {
    resolverRef.current?.(false);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setRequest(nextRequest);
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog request={request} onSettle={settle} />
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
