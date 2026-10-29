import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppLoadContext, EntryContext } from 'react-router';

const { handleRequestMock } = vi.hoisted(() => ({ handleRequestMock: vi.fn() }));

vi.mock('@vercel/react-router/entry.server', () => ({
  handleRequest: handleRequestMock,
  streamTimeout: 60000,
}));

const buildRouterContext = (errors?: Record<string, Error>): EntryContext =>
  ({ staticHandlerContext: { errors } }) as unknown as EntryContext;

const buildLoadContext = (): AppLoadContext => ({}) as unknown as AppLoadContext;

const renderPage = async (pathname = '/obra'): Promise<Headers> => {
  const { default: handleDocumentRequest } = await import('../entry.server');
  const responseHeaders = new Headers();
  await handleDocumentRequest(
    new Request(`http://localhost${pathname}`),
    200,
    responseHeaders,
    buildRouterContext(),
    buildLoadContext()
  );
  return responseHeaders;
};

describe('entry.server content security policy', () => {
  let previousVercelEnv: string | undefined;

  beforeEach(() => {
    previousVercelEnv = process.env.VERCEL_ENV;
    handleRequestMock.mockReset();
    handleRequestMock.mockResolvedValue(new Response('html'));
  });

  afterEach(() => {
    process.env.VERCEL_ENV = previousVercelEnv;
  });

  it('incluye directivas estrictas en la politica generada', async () => {
    const { buildContentSecurityPolicy } = await import('../entry.server');
    const policy = buildContentSecurityPolicy('abc123');

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("'nonce-abc123'");
  });

  it('emite la cabecera en produccion de Vercel', async () => {
    process.env.VERCEL_ENV = 'production';
    const headers = await renderPage();

    expect(headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });

  it('emite la cabecera en preview de Vercel', async () => {
    process.env.VERCEL_ENV = 'preview';
    const headers = await renderPage();

    expect(headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });

  it('no emite la cabecera en desarrollo local sin VERCEL_ENV', async () => {
    delete process.env.VERCEL_ENV;
    const headers = await renderPage();

    expect(headers.get('Content-Security-Policy')).toBeNull();
  });

  it('no emite la cabecera en desarrollo de Vercel', async () => {
    process.env.VERCEL_ENV = 'development';
    const headers = await renderPage();

    expect(headers.get('Content-Security-Policy')).toBeNull();
  });

  it('usa el mismo nonce en la cabecera y en el renderizado', async () => {
    process.env.VERCEL_ENV = 'preview';
    const headers = await renderPage();
    const callArgs = handleRequestMock.mock.calls[0] as unknown[];
    const renderOptions = callArgs[5] as { nonce: string };

    expect(headers.get('Content-Security-Policy')).toContain(
      `'nonce-${renderOptions.nonce}'`
    );
  });
});
