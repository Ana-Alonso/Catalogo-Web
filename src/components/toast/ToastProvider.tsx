import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './ToastContext';
import { ToastViewport } from './ToastViewport';
import type { ToastApi, ToastKind, ToastRecord } from '../../types/toast';

const MAX_VISIBLE_TOASTS = 3;

const DEFAULT_DURATION: Record<ToastKind, number> = {
  success: 4000,
  info: 4000,
  error: 6500,
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextIdRef = useRef(0);

  const dismiss = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string, durationMs?: number): string => {
      nextIdRef.current += 1;
      const id = `toast-${nextIdRef.current}`;
      const duration = durationMs ?? DEFAULT_DURATION[kind];
      const createdAt = Date.now();

      setToasts((prev) => {
        const duplicate = prev.find(
          (toast) => toast.kind === kind && toast.message === message
        );

        if (duplicate) {
          return prev.map((toast) =>
            toast.id === duplicate.id ? { ...toast, createdAt } : toast
          );
        }

        return [...prev, { id, kind, message, durationMs: duration, createdAt }].slice(
          -MAX_VISIBLE_TOASTS
        );
      });

      return id;
    },
    []
  );

  const value = useMemo<ToastApi>(
    () => ({
      success: (message, options) => push('success', message, options?.durationMs),
      error: (message, options) => push('error', message, options?.durationMs),
      info: (message, options) => push('info', message, options?.durationMs),
      dismiss,
      clear: () => setToasts([]),
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
