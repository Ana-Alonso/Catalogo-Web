import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useRegistrations } from '../useRegistrations';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from '../../services/registrationService';
import type { WorkshopRegistration } from '../../types/registrations';

vi.mock('../../services/registrationService', () => ({
  fetchRegistrations: vi.fn(),
  updateRegistrationStatus: vi.fn(),
  deleteRegistration: vi.fn(),
  withdrawMarketingConsent: vi.fn(),
  cancelWorkshopRegistrations: vi.fn(),
}));

const registro: WorkshopRegistration = {
  id: 'r1',
  product_id: 'p1',
  name: 'Laura',
  email: 'laura@example.com',
  status: 'pendiente',
  privacy_consent_at: null,
  marketing_consent: false,
  created_at: '2026-10-01T10:00:00.000Z',
};

describe('useRegistrations', () => {
  beforeEach(() => {
    vi.mocked(fetchRegistrations).mockResolvedValue([registro]);
    vi.mocked(updateRegistrationStatus).mockResolvedValue(registro);
    vi.mocked(deleteRegistration).mockResolvedValue(undefined);
  });

  it('limpia el error tras una acción correcta', async () => {
    vi.mocked(updateRegistrationStatus).mockRejectedValueOnce(
      new Error('actualización rechazada')
    );

    const { result } = renderHook(() => useRegistrations());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const updated = await act(async () =>
      result.current.setStatus('r1', 'confirmado')
    );
    expect(updated).toBe(false);
    expect(result.current.error).toBe('actualización rechazada');

    const removed = await act(async () => result.current.remove('r1'));
    expect(removed).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
