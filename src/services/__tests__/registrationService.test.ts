import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { RegistrationFormData, WorkshopRegistration } from '../../types/registrations';

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: { from: vi.fn(), rpc: vi.fn() },
}));

vi.mock('../../utils/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: supabaseMock,
}));

const loadService = async () => {
  vi.resetModules();
  return await import('../registrationService');
};

const formData = (
  name: string,
  email: string,
  overrides?: Partial<RegistrationFormData>
): RegistrationFormData => ({
  name,
  email,
  privacyConsent: true,
  marketingConsent: false,
  ...overrides,
});

const registrationRow: WorkshopRegistration = {
  id: 'reg-1',
  product_id: 'prod-1',
  name: 'Ana García',
  email: 'ana@example.com',
  status: 'pendiente',
  privacy_consent_at: '2026-11-01T10:00:00.000Z',
  marketing_consent: false,
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
      formData('  Ana García  ', '  ana@example.com  '),
      null
    );
    expect(created.status).toBe('pendiente');
    expect(created.name).toBe('Ana García');
    expect(created.email).toBe('ana@example.com');
  });

  it('guarda la marca de consentimiento de privacidad en el mock local', async () => {
    const service = await loadService();
    const created = await service.createRegistration(
      'prod-1',
      formData('Ana', 'ana@example.com'),
      null
    );
    expect(created.privacy_consent_at).toBeTruthy();
    expect(created.marketing_consent).toBe(false);
    expect(localStorage.getItem('laurel_workshop_registrations')).toContain('privacy_consent_at');
  });

  it('rechaza email duplicado en el mismo taller', async () => {
    const service = await loadService();
    await service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), null);
    await expect(
      service.createRegistration('prod-1', formData('Ana Otra', 'ANA@example.com'), null)
    ).rejects.toMatchObject({ code: 'alreadyRegistered' });
  });

  it('permite el mismo email en talleres distintos', async () => {
    const service = await loadService();
    await service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), null);
    const second = await service.createRegistration(
      'prod-2',
      formData('Ana', 'ana@example.com'),
      null
    );
    expect(second.product_id).toBe('prod-2');
  });

  it('rechaza inscripción cuando el taller está lleno', async () => {
    const service = await loadService();
    await service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), 1);
    await expect(
      service.createRegistration('prod-1', formData('Luis', 'luis@example.com'), 1)
    ).rejects.toMatchObject({ code: 'workshopFull' });
  });

  it('cuenta solo inscripciones no canceladas', async () => {
    const service = await loadService();
    const first = await service.createRegistration('prod-1', formData('Ana', 'a@a.com'), null);
    await service.createRegistration('prod-1', formData('Luis', 'l@l.com'), null);
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

  const mockRpcError = (code: string, message: string) => {
    supabaseMock.rpc.mockResolvedValue({ data: null, error: { code, message } });
  };

  it('mapea el error 23505 de duplicado al código alreadyRegistered', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    mockRpcError('23505', 'duplicate key value violates unique constraint');
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), null)
    ).rejects.toMatchObject({ code: 'alreadyRegistered' });
  });

  it('mapea workshop_full al código workshopFull', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    mockRpcError('P0001', 'workshop_full');
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), null)
    ).rejects.toMatchObject({ code: 'workshopFull' });
  });

  it('mapea registration_closed al código registrationClosed', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    mockRpcError('P0001', 'registration_closed');
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), null)
    ).rejects.toMatchObject({ code: 'registrationClosed' });
  });

  it('devuelve el código unknown ante un error desconocido', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    mockRpcError('XX000', 'algo raro');
    const service = await loadService();
    await expect(
      service.createRegistration('prod-1', formData('Ana', 'ana@example.com'), null)
    ).rejects.toMatchObject({ code: 'unknown' });
  });

  it('registra la inscripción a través de la RPC con los datos del formulario', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    const rpcSpy = supabaseMock.rpc.mockResolvedValue({ data: registrationRow, error: null });
    const service = await loadService();
    const created = await service.createRegistration(
      'prod-1',
      formData('  Ana  ', '  ana@example.com  '),
      5
    );
    expect(rpcSpy).toHaveBeenCalledWith('register_for_workshop', {
      p_product_id: 'prod-1',
      p_name: 'Ana',
      p_email: 'ana@example.com',
      p_privacy_consent_at: expect.any(String),
      p_marketing_consent: false,
    });
    expect(created.id).toBe('reg-1');
  });

  it('no fabrica la marca de consentimiento cuando no se dio', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    const rpcSpy = supabaseMock.rpc.mockResolvedValue({ data: registrationRow, error: null });
    const service = await loadService();
    await service.createRegistration(
      'prod-1',
      formData('Ana', 'ana@example.com', { privacyConsent: false, marketingConsent: true }),
      null
    );
    expect(rpcSpy).toHaveBeenCalledWith('register_for_workshop', {
      p_product_id: 'prod-1',
      p_name: 'Ana',
      p_email: 'ana@example.com',
      p_privacy_consent_at: null,
      p_marketing_consent: true,
    });
  });

  it('calcula las plazas ocupadas con la RPC sin leer inscripciones', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.rpc.mockResolvedValue({
      data: [
        { product_id: 'prod-1', taken: 2 },
        { product_id: 'prod-2', taken: '3' },
      ],
      error: null,
    });
    const service = await loadService();
    await expect(service.fetchRegistrationCounts()).resolves.toEqual({
      'prod-1': 2,
      'prod-2': 3,
    });
  });

  it('propaga el error de la RPC de recuentos', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.rpc.mockResolvedValue({ data: null, error: { message: 'permission denied' } });
    const service = await loadService();
    await expect(service.fetchRegistrationCounts()).rejects.toBeTruthy();
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

describe('registrationService · protección del consentimiento de marketing', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('bloquea el borrado local de una inscripción con consentimiento', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    const service = await loadService();
    const created = await service.createRegistration(
      'prod-1',
      formData('Ana', 'ana@example.com', { marketingConsent: true }),
      null
    );

    await expect(service.deleteRegistration(created.id)).rejects.toMatchObject({
      code: 'marketingConsentProtected',
    });
    await expect(service.fetchRegistrations()).resolves.toHaveLength(1);
  });

  it('borra en local una inscripción sin consentimiento', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    const service = await loadService();
    const created = await service.createRegistration(
      'prod-1',
      formData('Ana', 'ana@example.com'),
      null
    );

    await service.deleteRegistration(created.id);

    await expect(service.fetchRegistrations()).resolves.toHaveLength(0);
  });

  it('lanza notFound al borrar una inscripción local inexistente', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    const service = await loadService();

    await expect(service.deleteRegistration('desconocida')).rejects.toMatchObject({
      code: 'notFound',
    });
  });

  it('mapea el error marketing_consent_protected de Supabase', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      delete: () => ({
        eq: async () => ({
          error: { code: 'P0001', message: 'marketing_consent_protected' },
        }),
      }),
    });
    const service = await loadService();

    await expect(service.deleteRegistration('reg-1')).rejects.toMatchObject({
      code: 'marketingConsentProtected',
    });
  });

  it('mapea cualquier otro error de borrado a unknown', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      delete: () => ({
        eq: async () => ({ error: { code: '42501', message: 'permission denied' } }),
      }),
    });
    const service = await loadService();

    await expect(service.deleteRegistration('reg-1')).rejects.toMatchObject({
      code: 'unknown',
    });
  });
});
