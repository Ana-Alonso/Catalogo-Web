import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { rpcMock, productCategoryMock, consumeRateLimitMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  productCategoryMock: vi.fn(),
  consumeRateLimitMock: vi.fn(),
}));

vi.mock('../../../lib/server/supabaseAdmin', () => ({
  createSupabaseAdmin: () => ({
    rpc: rpcMock,
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: productCategoryMock }),
      }),
    }),
  }),
}));

vi.mock('../../../lib/server/rateLimit', () => ({
  consumeRateLimit: consumeRateLimitMock,
}));

const PRODUCT_ID = '00000000-0000-0000-0000-000000000002';

const registrationRow = {
  id: 'reg-1',
  product_id: PRODUCT_ID,
  name: 'Ana',
  email: 'ana@example.com',
  status: 'pendiente',
  privacy_consent_at: '2026-11-01T10:00:00.000Z',
  marketing_consent: false,
  created_at: '2026-11-01T10:00:00.000Z',
};

const postJson = (body: unknown, ip = '203.0.113.1') =>
  new Request('http://localhost/api/registrations', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

const validBody = () => ({
  productId: PRODUCT_ID,
  name: '  Ana  ',
  email: '  ana@example.com  ',
  privacyConsent: true,
  marketingConsent: true,
});

const loadRoute = async () => {
  vi.resetModules();
  return await import('../registrations');
};

describe('POST /api/registrations', () => {
  beforeEach(() => {
    rpcMock.mockReset();
    productCategoryMock.mockReset().mockResolvedValue({ data: { category: 'talleres' }, error: null });
    consumeRateLimitMock.mockReset().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('crea la inscripción con la RPC administrada y devuelve la fila', async () => {
    rpcMock.mockResolvedValue({ data: registrationRow, error: null });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody()) });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ id: 'reg-1' });
    expect(rpcMock).toHaveBeenCalledWith(
      'register_for_workshop',
      expect.objectContaining({
        p_product_id: PRODUCT_ID,
        p_name: 'Ana',
        p_email: 'ana@example.com',
        p_marketing_consent: true,
        p_quantity: 1,
      })
    );
  });

  it('fuerza una plaza en los talleres aunque el cliente pida más', async () => {
    rpcMock.mockResolvedValue({ data: registrationRow, error: null });
    const { action } = await loadRoute();
    await action({ request: postJson({ ...validBody(), quantity: 3 }) });

    const args = rpcMock.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(args.p_quantity).toBe(1);
  });

  it('repercute la cantidad pedida en la RPC para una edición especial', async () => {
    rpcMock.mockResolvedValue({ data: registrationRow, error: null });
    productCategoryMock.mockResolvedValue({ data: { category: 'especiales' }, error: null });
    const { action } = await loadRoute();
    await action({ request: postJson({ ...validBody(), quantity: 3 }, '203.0.113.50') });

    const args = rpcMock.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(args.p_quantity).toBe(3);
  });

  it('pone la marca de consentimiento en el servidor', async () => {
    rpcMock.mockResolvedValue({ data: registrationRow, error: null });
    const { action } = await loadRoute();
    await action({ request: postJson(validBody()) });

    const args = rpcMock.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(typeof args.p_privacy_consent_at).toBe('string');
  });

  it.each([
    ['email inválido', { ...validBody(), email: 'no-es-email' }],
    ['productId que no es UUID', { ...validBody(), productId: 'prod-1' }],
    ['nombre vacío', { ...validBody(), name: '   ' }],
    ['sin consentimiento de privacidad', { ...validBody(), privacyConsent: false }],
    ['quantity fuera de rango', { ...validBody(), quantity: 11 }],
    ['payload que no es objeto', 'texto'],
  ])('rechaza un %s sin tocar la base de datos', async (_label, body) => {
    const { action } = await loadRoute();
    const response = await action({ request: postJson(body) });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalidData' });
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('traduce el duplicado de la base de datos a 409 alreadyRegistered', async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody()) });

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'alreadyRegistered' });
  });

  it('traduce workshop_full a 409 y registration_closed a 409', async () => {
    const { action } = await loadRoute();

    rpcMock.mockResolvedValue({ data: null, error: { code: 'P0001', message: 'workshop_full' } });
    const full = await action({ request: postJson(validBody(), '203.0.113.20') });
    expect(full.status).toBe(409);
    expect(await full.json()).toEqual({ error: 'workshopFull' });

    rpcMock.mockResolvedValue({
      data: null,
      error: { code: 'P0001', message: 'registration_closed' },
    });
    const closed = await action({ request: postJson(validBody(), '203.0.113.21') });
    expect(closed.status).toBe(409);
    expect(await closed.json()).toEqual({ error: 'registrationClosed' });
  });

  it('traduce not_a_workshop a 400 invalidData', async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: 'P0001', message: 'not_a_workshop' },
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody(), '203.0.113.26') });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalidData' });
  });

  it('traduce invalid_quantity a 400 invalidData', async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: 'P0001', message: 'invalid_quantity' },
    });
    const { action } = await loadRoute();
    const response = await action({
      request: postJson({ ...validBody(), quantity: 4 }, '203.0.113.27'),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalidData' });
  });

  it('traduce una clave foránea inexistente en 400 invalidData', async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { code: '23503', message: 'violates foreign key constraint' },
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody(), '203.0.113.25') });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalidData' });
  });

  it('devuelve 500 unknown cuando la base de datos lanza', async () => {
    rpcMock.mockRejectedValue(new Error('fallo de conexión'));
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody(), '203.0.113.30') });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'unknown' });
  });

  it('rechaza un producto inexistente sin llamar a la RPC', async () => {
    productCategoryMock.mockResolvedValue({ data: null, error: null });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody(), '203.0.113.51') });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalidData' });
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('devuelve 500 unknown si la categoría del producto no puede leerse', async () => {
    productCategoryMock.mockResolvedValue({
      data: null,
      error: { code: '42P01', message: 'relation not found' },
    });
    const { action } = await loadRoute();
    const response = await action({ request: postJson(validBody(), '203.0.113.52') });

    expect(response.status).toBe(500);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('limita las inscripciones por dirección IP', async () => {
    rpcMock.mockResolvedValue({ data: registrationRow, error: null });
    const { action } = await loadRoute();
    const ip = '203.0.113.40';

    consumeRateLimitMock.mockResolvedValue({ allowed: false, retryAfterSeconds: 120 });
    const blocked = await action({ request: postJson(validBody(), ip) });

    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: 'rateLimited' });
    expect(blocked.headers.get('Retry-After')).toBe('120');
    expect(rpcMock).not.toHaveBeenCalled();
    expect(consumeRateLimitMock).toHaveBeenCalledWith(
      `workshop-registration:${ip}`,
      5,
      60 * 60 * 1000
    );
  });

  it('no permite escribir con métodos que no son POST y anuncia Allow', async () => {
    const { action } = await loadRoute();
    const response = await action({
      request: new Request('http://localhost/api/registrations', { method: 'GET' }),
    });

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('no permite leer la colección con GET', async () => {
    const { loader } = await loadRoute();
    const response = loader();

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });
});
