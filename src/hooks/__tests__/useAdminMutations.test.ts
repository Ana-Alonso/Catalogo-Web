import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import ToastProvider from '../../components/toast/ToastProvider';
import { useAdminMutations } from '../useAdminMutations';
import type { CatalogItem } from '../../types/catalog';

const workshop = {
  id: 'w-1',
  title: 'Taller de acuarela',
  description: 'Descripción',
  image: '/img/taller.jpg',
  category: 'talleres',
  status: 'disponible',
  isVisible: true,
} as CatalogItem;

const buildMutations = (overrides: Record<string, unknown> = {}) => {
  const callbacks = {
    onAddProduct: vi.fn().mockResolvedValue(true),
    onEditProduct: vi.fn().mockResolvedValue(true),
    onEditEtsyMetadata: vi.fn().mockResolvedValue(true),
    onDeleteProduct: vi.fn().mockResolvedValue(true),
    onSetProductVisibility: vi.fn().mockResolvedValue(true),
    onCancelWorkshop: vi.fn().mockResolvedValue(true),
    onRestoreWorkshop: vi.fn().mockResolvedValue(true),
    onCancelWorkshopRegistrations: vi.fn().mockResolvedValue(true),
    onRefreshRegistrations: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  const { result } = renderHook(
    () => useAdminMutations(callbacks),
    { wrapper: ToastProvider }
  );

  return { result, callbacks };
};

describe('useAdminMutations · cancelar taller', () => {
  it('cancela también las inscripciones del taller', async () => {
    const { result, callbacks } = buildMutations();

    await act(async () => {
      await result.current.handleCancelWorkshop(workshop);
    });

    expect(callbacks.onCancelWorkshop).toHaveBeenCalledWith('w-1');
    expect(callbacks.onCancelWorkshopRegistrations).toHaveBeenCalledWith('w-1');
    expect(callbacks.onRefreshRegistrations).toHaveBeenCalledTimes(1);
    expect(callbacks.onRestoreWorkshop).not.toHaveBeenCalled();
  });

  it('revierte el marcado si las inscripciones no se cancelan', async () => {
    const { result, callbacks } = buildMutations({
      onCancelWorkshopRegistrations: vi.fn().mockResolvedValue(false),
    });

    await act(async () => {
      await result.current.handleCancelWorkshop(workshop);
    });

    expect(callbacks.onRestoreWorkshop).toHaveBeenCalledWith('w-1');
  });

  it('no toca las inscripciones si el marcado del taller falla', async () => {
    const { result, callbacks } = buildMutations({
      onCancelWorkshop: vi.fn().mockResolvedValue(false),
    });

    await act(async () => {
      await result.current.handleCancelWorkshop(workshop);
    });

    expect(callbacks.onCancelWorkshopRegistrations).not.toHaveBeenCalled();
    expect(callbacks.onRefreshRegistrations).not.toHaveBeenCalled();
    expect(callbacks.onRestoreWorkshop).not.toHaveBeenCalled();
  });
});
