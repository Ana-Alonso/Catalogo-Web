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

const STORAGE_KEY = 'laurel_custom_products_v2';

const mockVisibilityUpdate = () => {
  const updateSpy = vi.fn((payload: Record<string, unknown>) => {
    void payload;
    return {
      eq: () => ({
        select: () => ({
          single: async () => ({ data: { ...row, ...payload }, error: null }),
        }),
      }),
    };
  });
  supabaseMock.from.mockReturnValue({ update: updateSpy });
  return updateSpy;
};

describe('productService · visibilidad de productos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  it('archiva un producto local enviando isVisible false', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    const updateSpy = mockVisibilityUpdate();
    const { setProductVisibility } = await loadService();

    const updated = await setProductVisibility('prod-1', false);

    expect(updateSpy).toHaveBeenCalledWith({ isVisible: false });
    expect(updated.isVisible).toBe(false);
  });

  it('vuelve a publicar un producto enviando isVisible true', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    const updateSpy = mockVisibilityUpdate();
    const { setProductVisibility } = await loadService();

    const updated = await setProductVisibility('prod-1', true);

    expect(updateSpy).toHaveBeenCalledWith({ isVisible: true });
    expect(updated.isVisible).toBe(true);
  });

  it('propaga el error de Supabase al cambiar la visibilidad', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    supabaseMock.from.mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: 'permission denied' } }),
          }),
        }),
      }),
    });
    const { setProductVisibility } = await loadService();

    await expect(setProductVisibility('prod-1', false)).rejects.toBeTruthy();
  });

  it('archiva en localStorage cuando la app funciona con mocks', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([row, { ...row, id: 'prod-2' }]));
    const { setProductVisibility } = await loadService();

    const updated = await setProductVisibility('prod-1', false);

    expect(updated.isVisible).toBe(false);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CatalogItem[];
    expect(stored.find((item) => item.id === 'prod-1')?.isVisible).toBe(false);
    expect(stored.find((item) => item.id === 'prod-2')?.isVisible).toBe(true);
  });

  it('lanza error si el producto no existe en localStorage', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    const { setProductVisibility } = await loadService();

    await expect(setProductVisibility('desconocido', false)).rejects.toThrow(
      'Producto no encontrado.'
    );
  });
});
