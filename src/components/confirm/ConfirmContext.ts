import { createContext } from 'react';
import type { ConfirmFn } from '../../types/confirm';

export const ConfirmContext = createContext<ConfirmFn | null>(null);
