import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { CatalogItem, ProductFormData } from '../../types/catalog';

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: { from: vi.fn(), storage: { from: vi.fn() } },
}));

vi.mock('../../utils/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: supabaseMock,
}));

const loadService = async () => {
  vi.resetModules();
  return await import('../productService');
};

const row: CatalogItem = {
  id: 'prod-1',
  title: 'Obra',
  description: 'Descripción',
  image: 'img.png',
  category: 'ilustraciones',
  status: 'disponible',
  source: 'local',
  currency: 'EUR',
  priceCents: 2500,
  isVisible: true,
};

const formData = (overrides: Partial<ProductFormData> = {}): ProductFormData => ({
  title: 'Obra',
  description: 'Descripción',
  category: 'ilustraciones',
  imageUrl: 'img.png',
  price: '25,00',
  status: 'disponible',
  ...overrides,
});

const mockUpdate = () => {
  const updateSpy = vi.fn((payload: Record<string, unknown>) => {
    void payload;
    return {
      eq: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: row, error: null }),
          }),
        }),
      }),
    };
  });
  supabaseMock.from.mockReturnValue({ update: updateSpy });
  return updateSpy;
};

describe('productService · payload de talleres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no envía registrationDeadline al guardar productos que no son talleres', async () => {
    const updateSpy = mockUpdate();
    const { updateProduct } = await loadService();

    await updateProduct('prod-1', formData());

    const payload = updateSpy.mock.calls[0][0];
    expect(payload).not.toHaveProperty('registrationDeadline');
    expect(payload).not.toHaveProperty('cupo');
  });

  it('envía el plazo y el cupo al guardar talleres', async () => {
    const updateSpy = mockUpdate();
    const { updateProduct } = await loadService();

    await updateProduct(
      'prod-1',
      formData({
        category: 'talleres',
        eventDate: '2026-11-20T18:00',
        eventLocation: 'Estudio',
        cupo: '8',
        registrationDeadline: '2026-11-10T18:00',
      })
    );

    const payload = updateSpy.mock.calls[0][0];
    expect(payload.cupo).toBe(8);
    expect(payload.eventLocation).toBe('Estudio');
    expect(payload.registrationDeadline).toBe(new Date('2026-11-10T18:00').toISOString());
  });

  it('envía el plazo como null cuando el taller no tiene límite', async () => {
    const updateSpy = mockUpdate();
    const { updateProduct } = await loadService();

    await updateProduct('prod-1', formData({ category: 'talleres' }));

    const payload = updateSpy.mock.calls[0][0];
    expect(payload.registrationDeadline).toBeNull();
    expect(payload.cupo).toBeNull();
  });
});
