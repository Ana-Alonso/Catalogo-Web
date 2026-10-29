import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hideEtsyListing, syncEtsyListings, syncSingleEtsyListing } from '../etsySync';
import { EtsyApiError } from '../etsyClient';

const { dbMock, getEtsyAccessTokenMock, markEtsySyncMock } = vi.hoisted(() => {
  type DbError = { code?: string; message?: string } | null;
  const selectProductsMock = vi.fn();
  const maybeSingleMock = vi.fn();
  const eqMock = vi.fn((column: unknown) =>
    column === 'source' ? selectProductsMock() : { maybeSingle: maybeSingleMock },
  );
  const updateEqMock = vi.fn();
  const updatePayloads: unknown[] = [];
  const insertPayloads: unknown[] = [];
  const updateMock = vi.fn((payload: unknown) => {
    updatePayloads.push(payload);
    return { eq: updateEqMock };
  });
  const insertMock = vi.fn(
    (payload: unknown): Promise<{ error: DbError }> => {
      insertPayloads.push(payload);
      return Promise.resolve({ error: null });
    },
  );
  const fromMock = vi.fn(() => ({
    select: vi.fn(() => ({ eq: eqMock })),
    update: updateMock,
    insert: insertMock,
  }));

  return {
    dbMock: {
      fromMock,
      selectProductsMock,
      maybeSingleMock,
      eqMock,
      updateMock,
      updateEqMock,
      insertMock,
      updatePayloads,
      insertPayloads,
    },
    getEtsyAccessTokenMock: vi.fn(),
    markEtsySyncMock: vi.fn(),
  };
});

vi.mock('../supabaseAdmin', () => ({
  createSupabaseAdmin: () => ({ from: dbMock.fromMock }),
}));

vi.mock('../etsyAuth', () => ({
  getEtsyAccessToken: getEtsyAccessTokenMock,
  markEtsySync: markEtsySyncMock,
}));

const requiredEnv: Record<string, string> = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  SUPABASE_ANON_KEY: 'anon-key',
  ETSY_KEYSTRING: 'keystring',
  ETSY_SHARED_SECRET: 'shared-secret',
  ETSY_SHOP_ID: '7777',
  ETSY_WEBHOOK_SECRET: 'webhook-secret',
  ETSY_TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 3).toString('base64'),
  CRON_SECRET: 'cron-secret-de-prueba',
};

const originalEnv = { ...process.env };

interface StubbedResponse {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}

const jsonResponse = (payload: unknown): StubbedResponse => ({
  ok: true,
  status: 200,
  text: async () => JSON.stringify(payload),
});

const failResponse = (status: number, body: string): StubbedResponse => ({
  ok: false,
  status,
  text: async () => body,
});

const stubEtsyFetch = (handler: (url: string) => StubbedResponse): ReturnType<typeof vi.fn> => {
  const fetchMock = vi.fn(async (input: unknown) => handler(String(input)));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const activeListing = {
  listing_id: 11,
  title: 'Ilustración once',
  state: 'active',
  quantity: 2,
  url: 'https://www.etsy.com/listing/11',
  price: { amount: 1500, divisor: 100, currency_code: 'EUR' },
  images: [{ listing_image_id: 1, rank: 1, url_570xN: 'https://etsy.test/once.jpg' }],
};

const listingWithoutImage = {
  listing_id: 12,
  title: 'Ilustración doce',
  state: 'active',
  quantity: 1,
};

const soldOutListing = {
  listing_id: 12,
  title: 'Ilustración doce',
  state: 'inactive',
  quantity: 0,
};

const secondPageImage = {
  listing_image_id: 5,
  rank: 1,
  url_fullxfull: 'https://etsy.test/dos.jpg',
};

const existingRow = {
  id: 'p-uno',
  etsyListingId: 11,
  isVisible: true,
};

const retiredRow = {
  id: 'p-diez',
  etsyListingId: 10,
  isVisible: true,
};

const hiddenRow = {
  id: 'p-veinte',
  etsyListingId: 20,
  isVisible: false,
};

const resetDb = (): void => {
  dbMock.fromMock.mockReset().mockImplementation(() => ({
    select: vi.fn(() => ({ eq: dbMock.eqMock })),
    update: dbMock.updateMock,
    insert: dbMock.insertMock,
  }));
  dbMock.eqMock.mockReset().mockImplementation((column: unknown) =>
    column === 'source' ? dbMock.selectProductsMock() : { maybeSingle: dbMock.maybeSingleMock },
  );
  dbMock.selectProductsMock.mockReset().mockResolvedValue({ data: [], error: null });
  dbMock.maybeSingleMock.mockReset().mockResolvedValue({ data: null, error: null });
  dbMock.updateEqMock.mockReset().mockResolvedValue({ error: null });
  dbMock.updateMock.mockReset().mockImplementation((payload: unknown) => {
    dbMock.updatePayloads.push(payload);
    return { eq: dbMock.updateEqMock };
  });
  dbMock.insertMock.mockReset().mockImplementation((payload: unknown) => {
    dbMock.insertPayloads.push(payload);
    return Promise.resolve({ error: null });
  });
  dbMock.updatePayloads.length = 0;
  dbMock.insertPayloads.length = 0;
};

describe('syncEtsyListings · flujo completo contra la API de Etsy', () => {
  beforeEach(() => {
    Object.assign(process.env, requiredEnv);
    resetDb();
    getEtsyAccessTokenMock.mockReset().mockResolvedValue('token-de-prueba');
    markEtsySyncMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  it('crea los nuevos, actualiza los existentes y oculta los retirados', async () => {
    stubEtsyFetch((url) => {
      if (url.includes('/listings?state=active')) {
        return jsonResponse({ results: [activeListing, listingWithoutImage] });
      }
      if (url.endsWith('/listings/12/images')) {
        return jsonResponse({ results: [secondPageImage] });
      }
      return jsonResponse({ results: [] });
    });
    dbMock.selectProductsMock.mockResolvedValue({
      data: [existingRow, retiredRow, hiddenRow],
      error: null,
    });

    const result = await syncEtsyListings();

    expect(result).toEqual({ created: 1, updated: 1, hidden: 1, total: 3 });
    expect(dbMock.updateEqMock).toHaveBeenCalledWith('id', 'p-uno');
    expect(dbMock.updateEqMock).toHaveBeenCalledWith('etsyListingId', 10);
    expect(dbMock.insertPayloads[0]).toMatchObject({
      etsyListingId: 12,
      isVisible: true,
      image: 'https://etsy.test/dos.jpg',
      category: 'ilustraciones',
    });
    expect(dbMock.updatePayloads.at(-1)).toMatchObject({
      isVisible: false,
      etsyState: 'inactive',
    });
    expect(markEtsySyncMock).toHaveBeenCalledTimes(1);
  });

  it('envía el token de acceso obtenido por etsyAuth en cada petición', async () => {
    const fetchMock = stubEtsyFetch(() => jsonResponse({ results: [] }));

    await syncEtsyListings();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://api.etsy.com/v3/application/shops/7777/listings'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-de-prueba' }),
      })
    );
  });

  it('renueva el token y reintenta una sola vez cuando Etsy responde 401', async () => {
    let attempts = 0;
    stubEtsyFetch(() => {
      attempts += 1;
      return attempts === 1
        ? failResponse(401, 'token expirado')
        : jsonResponse({ results: [] });
    });

    const result = await syncEtsyListings();

    expect(result).toEqual({ created: 0, updated: 0, hidden: 0, total: 0 });
    expect(getEtsyAccessTokenMock).toHaveBeenCalledWith(true);
    expect(getEtsyAccessTokenMock).toHaveBeenCalledTimes(3);
  });

  it('propaga un EtsyApiError cuando la API responde con un error de servidor', async () => {
    stubEtsyFetch(() => failResponse(500, 'fallo momentáneo de Etsy'));

    await expect(syncEtsyListings()).rejects.toThrow(EtsyApiError);
    expect(dbMock.updatePayloads).toHaveLength(0);
    expect(markEtsySyncMock).not.toHaveBeenCalled();
  });

  it('aborta la sincronización cuando no se pueden leer las credenciales', async () => {
    stubEtsyFetch(() => jsonResponse({ results: [] }));
    getEtsyAccessTokenMock.mockRejectedValue(
      new Error('No hay credenciales de Etsy. Ejecuta scripts/etsy-oauth.mjs o define ETSY_REFRESH_TOKEN.')
    );

    await expect(syncEtsyListings()).rejects.toThrow('No hay credenciales de Etsy');
    expect(dbMock.insertPayloads).toHaveLength(0);
    expect(dbMock.updatePayloads).toHaveLength(0);
    expect(markEtsySyncMock).not.toHaveBeenCalled();
  });

  it('falla con un mensaje propio cuando la lectura local de productos falla', async () => {
    stubEtsyFetch(() => jsonResponse({ results: [] }));
    dbMock.selectProductsMock.mockResolvedValue({ data: null, error: { message: 'permiso denegado' } });

    await expect(syncEtsyListings()).rejects.toThrow(
      'No se pudieron leer los productos de Etsy (permiso denegado).'
    );
  });

  it('falla si Etsy devuelve una respuesta que no es JSON', async () => {
    stubEtsyFetch(() => ({ ok: true, status: 200, text: async () => 'no-es-json' }));

    await expect(syncEtsyListings()).rejects.toThrow(
      'Etsy devolvió una respuesta que no es JSON.'
    );
  });

  it('recurre a actualizar cuando el insert choca con un duplicado', async () => {
    stubEtsyFetch((url) =>
      url.includes('/listings?state=active')
        ? jsonResponse({ results: [activeListing] })
        : jsonResponse({ results: [] })
    );
    dbMock.insertMock.mockImplementation(() => Promise.resolve({ error: { code: '23505' } }));

    const result = await syncEtsyListings();

    expect(result.created).toBe(1);
    expect(dbMock.updateEqMock).toHaveBeenCalledWith('etsyListingId', 11);
  });

  it('aborta si ocultar un producto retirado falla en la base de datos', async () => {
    stubEtsyFetch(() => jsonResponse({ results: [] }));
    dbMock.selectProductsMock.mockResolvedValue({ data: [retiredRow], error: null });
    dbMock.updateEqMock.mockResolvedValue({ error: { message: 'sin permiso' } });

    await expect(syncEtsyListings()).rejects.toThrow('No se pudo ocultar el producto 10.');
  });
});

describe('syncSingleEtsyListing · decisión por publicación individual', () => {
  beforeEach(() => {
    Object.assign(process.env, requiredEnv);
    resetDb();
    getEtsyAccessTokenMock.mockReset().mockResolvedValue('token-de-prueba');
    markEtsySyncMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  it('oculta el producto local cuando Etsy responde 404', async () => {
    stubEtsyFetch(() => failResponse(404, 'listing no encontrado'));

    await expect(syncSingleEtsyListing(55)).resolves.toBeUndefined();

    expect(dbMock.updatePayloads[0]).toMatchObject({ isVisible: false, etsyState: 'inactive' });
    expect(dbMock.updateEqMock).toHaveBeenCalledWith('etsyListingId', 55);
    expect(dbMock.maybeSingleMock).not.toHaveBeenCalled();
  });

  it('relanza los errores de Etsy que no son 404', async () => {
    stubEtsyFetch(() => failResponse(500, 'fallo momentáneo de Etsy'));

    await expect(syncSingleEtsyListing(55)).rejects.toThrow(EtsyApiError);
    expect(dbMock.updatePayloads).toHaveLength(0);
  });

  it('actualiza la fila existente manteniendo el producto visible', async () => {
    stubEtsyFetch((url) =>
      url.endsWith('/listings/11?includes=Images')
        ? jsonResponse(activeListing)
        : jsonResponse({ results: [] })
    );
    dbMock.maybeSingleMock.mockResolvedValue({ data: { id: 'p-uno' }, error: null });

    await syncSingleEtsyListing(11);

    expect(dbMock.updatePayloads[0]).toMatchObject({ etsyListingId: 11, isVisible: true });
    expect(dbMock.updateEqMock).toHaveBeenCalledWith('id', 'p-uno');
    expect(dbMock.insertPayloads).toHaveLength(0);
  });

  it('inserta un listing activo que aún no existe en la base local', async () => {
    stubEtsyFetch((url) =>
      url.endsWith('/listings/12/images')
        ? jsonResponse({ results: [secondPageImage] })
        : jsonResponse(listingWithoutImage)
    );

    await syncSingleEtsyListing(12);

    expect(dbMock.insertPayloads[0]).toMatchObject({
      etsyListingId: 12,
      isVisible: true,
      image: 'https://etsy.test/dos.jpg',
    });
    expect(dbMock.updatePayloads).toHaveLength(0);
  });

  it('no inserta nada cuando el listing está inactivo y no existe localmente', async () => {
    stubEtsyFetch((url) =>
      url.endsWith('/images') ? jsonResponse({ results: [] }) : jsonResponse(soldOutListing)
    );

    await syncSingleEtsyListing(12);

    expect(dbMock.insertPayloads).toHaveLength(0);
    expect(dbMock.updatePayloads).toHaveLength(0);
  });

  it('falla si la lectura local del producto devuelve error', async () => {
    stubEtsyFetch(() => jsonResponse(activeListing));
    dbMock.maybeSingleMock.mockResolvedValue({ data: null, error: { message: 'sin permiso' } });

    await expect(syncSingleEtsyListing(11)).rejects.toThrow('No se pudo leer el producto 11.');
  });

  it('falla al crear cuando la base de datos devuelve un error inesperado', async () => {
    stubEtsyFetch(() => jsonResponse(activeListing));
    dbMock.insertMock.mockImplementation(() =>
      Promise.resolve({ error: { code: '42501', message: 'violación de política' } })
    );

    await expect(syncSingleEtsyListing(11)).rejects.toThrow('No se pudo crear el producto 11.');
  });
});

describe('hideEtsyListing · ocultado directo por id de publicación', () => {
  beforeEach(() => {
    Object.assign(process.env, requiredEnv);
    resetDb();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('marca el producto como invisible e inactivo', async () => {
    await hideEtsyListing(55);

    expect(dbMock.updatePayloads[0]).toMatchObject({
      isVisible: false,
      etsyState: 'inactive',
    });
    expect(dbMock.updateEqMock).toHaveBeenCalledWith('etsyListingId', 55);
  });

  it('propaga el error de la base de datos con un mensaje propio', async () => {
    dbMock.updateEqMock.mockResolvedValue({ error: { message: 'sin permiso' } });

    await expect(hideEtsyListing(55)).rejects.toThrow('No se pudo ocultar el producto 55.');
  });
});
