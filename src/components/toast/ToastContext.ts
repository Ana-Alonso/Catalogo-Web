import { createContext } from 'react';
import type { ToastApi } from '../../types/toast';

export const ToastContext = createContext<ToastApi | null>(null);
