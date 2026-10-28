import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useNow } from '../useNow';

const at = (iso: string): number => Date.parse(iso);

describe('useNow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve la hora actual al montar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));

    const { result } = renderHook(() => useNow());

    expect(result.current).toBe(at('2026-11-05T12:00:00.000Z'));
  });

  it('avanza con el reloj cada 30 segundos por defecto', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));

    const { result } = renderHook(() => useNow());

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current).toBe(at('2026-11-05T12:00:30.000Z'));
  });

  it('respeta un intervalo personalizado', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));

    const { result } = renderHook(() => useNow(5_000));

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(result.current).toBe(at('2026-11-05T12:00:05.000Z'));
  });

  it('refresca al volver a la pestaña sin esperar al intervalo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));

    const { result } = renderHook(() => useNow(60_000));

    act(() => {
      vi.setSystemTime(new Date('2026-11-05T13:00:00.000Z'));
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe(at('2026-11-05T13:00:00.000Z'));
  });

  it('cancela el intervalo al desmontar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));

    const { unmount } = renderHook(() => useNow(1_000));
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
