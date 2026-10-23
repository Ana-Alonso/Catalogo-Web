import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { WorkshopRegistration } from '../../types/registrations';

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: { from: vi.fn() },
}));

vi.mock('../../utils/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: supabaseMock,
}));

const loadService = async () => {
  vi.resetModules();
  return await import('../registrationService');
};

const registrationRow: WorkshopRegistration = {
  id: 'reg-1',
  product_id: 'prod-1',
  name: 'Ana García',
  email: 'ana@example.com',
  status: 'pendiente',
  created_at: '2026-11-01T10:00:00.000Z',
};

describe('registrationService en modo mock (localStorage)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('crea una inscripción pendiente con nombre y email recortados', async () => {
    const service = await loadService();
    const created = await service.createRegistration(
      'prod-1',
      { name: '  Ana García  ', email: '  ana@example.com  ' },
      null
    );
    expect(created.status).toBe('pendiente');
    expect(created.name).toBe('Ana García');
    expect(created.email).toBe('ana@example.com');
  });

  it('rechaza email duplicado en el mismo taller', async () => {
    const service = await loadService();
    await service.createRegistration('prod-1', { name: 'Ana', email: 'ana@example.com' }, null);
    await expect(
      service.createRegistration('prod-1', { name: 'Ana Otra', email: 'ANA@example.com' }, null)
    ).rejects.toMatchObject({ code: 'alreadyRegistered' });
  });

  it('permite el mismo email en talleres distintos', async () => {
    const service = await loadService();
    await service.createRegistration('prod-1', { name: 'Ana', email: 'ana@example.com' }, null);
    const second = await service.createRegistration(
      'prod-2',
      { name: 'Ana', email: 'ana@example.com' },
      null
    );
    expect(second.product_id).toBe('prod-2');
  });

  it('rechaza inscripción cuando el taller está lleno', async () => {
    const service = await loadService();
    await service.createRegistration('prod-1', { name: 'Ana', email: 'ana@example.com' }, 1);
    await expect(
      service.createRegistration('prod-1', { name: 'Luis', email: 'luis@example.com' }, 1)
    ).rejects.toMatchObject({ code: 'workshopFull' });
  });

  it('cuenta solo inscripciones no canceladas', async () => {
    const service = await loadService();
    const first = await service.createRegistration('prod-1', { name: 'Ana', email: 'a@a.com' }, null);
    await service.createRegistration('prod-1', { name: 'Luis', email: 'l@l.com' }, null);
    await service.updateRegistrationStatus(first.id, 'cancelado');
    const counts = await service.fetchRegistrationCounts();
    expect(counts['prod-1']).toBe(1);
  });
});

describe('registrationService contra Supabase (mock del cliente)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('mapea el error 23505 de duplicado al código alreadyRegistered', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: { code: '23505', message: 'duplicate key value violates unique constraint' },
          }),
        }),
      }),
    });
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', { name: 'Ana', email: 'ana@example.com' }, null)
    ).rejects.toMatchObject({ code: 'alreadyRegistered' });
  });

  it('mapea workshop_full al código workshopFull', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: { code: 'P0001', message: 'workshop_full: no hay plazas' },
          }),
        }),
      }),
    });
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', { name: 'Ana', email: 'ana@example.com' }, null)
    ).rejects.toMatchObject({ code: 'workshopFull' });
  });

  it('devuelve el código unknown ante un error desconocido', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: { code: 'XX000', message: 'algo raro' },
          }),
        }),
      }),
    });
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', { name: 'Ana', email: 'ana@example.com' }, null)
    ).rejects.toMatchObject({ code: 'unknown' });
  });

  it('inserta únicamente product_id, name y email (el status lo pone el servidor)', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    const insertSpy = vi.fn(() => ({
      select: () => ({
        single: async () => ({ data: registrationRow, error: null }),
      }),
    }));
    supabaseMock.from.mockReturnValue({ insert: insertSpy });
    const service = await loadService();
    const created = await service.createRegistration(
      'prod-1',
      { name: 'Ana', email: 'ana@example.com' },
      5
    );
    expect(insertSpy).toHaveBeenCalledWith([{ product_id: 'prod-1', name: 'Ana', email: 'ana@example.com' }]);
    expect(created.id).toBe('reg-1');
  });

  it('lanza error si fetchRegistrations recibe un error de Supabase', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      select: () => ({
        order: async () => ({ data: null, error: { message: 'permission denied' } }),
      }),
    });
    const service = await loadService();
    await expect(service.fetchRegistrations()).rejects.toBeTruthy();
  });
});
