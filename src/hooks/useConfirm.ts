import { useContext } from 'react';
import { ConfirmContext } from '../components/confirm/ConfirmContext';

export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
  }

  return context;
};
