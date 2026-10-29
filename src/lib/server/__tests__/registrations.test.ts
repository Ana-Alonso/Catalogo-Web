import { describe, it, expect } from 'vitest';
import {
  parseRegistrationClaim,
  readRegistrationClaim,
  resolveClientIp,
} from '../registrations';

const PRODUCT_ID = '00000000-0000-0000-0000-000000000002';

const claimBody = (overrides?: Record<string, unknown>) => ({
  productId: PRODUCT_ID,
  name: 'Ana García',
  email: 'ana@example.com',
  privacyConsent: true,
  marketingConsent: false,
  ...overrides,
});

describe('parseRegistrationClaim', () => {
  it('recorta nombre y email y activa el consentimiento de marketing', () => {
    const parsed = parseRegistrationClaim(
      claimBody({ name: '  Ana García  ', email: '  ana@example.com  ', marketingConsent: true })
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    expect(parsed.claim).toEqual({
      productId: PRODUCT_ID,
      name: 'Ana García',
      email: 'ana@example.com',
      privacyConsentAt: expect.any(String),
      marketingConsent: true,
    });
  });

  it.each([
    ['productId ausente', claimBody({ productId: undefined })],
    ['productId con SQL injection', claimBody({ productId: "1' OR '1'='1" })],
    ['nombre demasiado largo', claimBody({ name: 'A'.repeat(81) })],
    ['email demasiado largo', claimBody({ email: `${'a'.repeat(250)}@example.com` })],
    ['privacyConsent ausente', claimBody({ privacyConsent: undefined })],
  ])('rechaza %s', (_label, body) => {
    expect(parseRegistrationClaim(body)).toEqual({ ok: false, code: 'invalidData' });
  });

  it.each([null, undefined, 'texto', 42, []])('rechaza el payload %s', (payload) => {
    expect(parseRegistrationClaim(payload)).toEqual({ ok: false, code: 'invalidData' });
  });

  it('trata como falso un consentimiento de marketing ausente', () => {
    const parsed = parseRegistrationClaim(claimBody({ marketingConsent: undefined }));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    expect(parsed.claim.marketingConsent).toBe(false);
  });
});

describe('readRegistrationClaim', () => {
  const requestWithBody = (body: string) =>
    new Request('http://localhost/api/registrations', { method: 'POST', body });

  it('rechaza un cuerpo que no es JSON', async () => {
    await expect(readRegistrationClaim(requestWithBody('{roto'))).resolves.toEqual({
      ok: false,
      code: 'invalidData',
    });
  });

  it('rechaza un cuerpo demasiado grande', async () => {
    const huge = requestWithBody(JSON.stringify(claimBody({ name: 'B'.repeat(5000) })));
    await expect(readRegistrationClaim(huge)).resolves.toEqual({
      ok: false,
      code: 'invalidData',
    });
  });

  it('acepta un cuerpo válido', async () => {
    const parsed = await readRegistrationClaim(requestWithBody(JSON.stringify(claimBody())));
    expect(parsed.ok).toBe(true);
  });
});

describe('resolveClientIp', () => {
  it('prioriza x-real-ip frente a una cadena forjada', () => {
    const headers = new Headers({
      'x-real-ip': '198.51.100.4',
      'x-forwarded-for': '203.0.113.9, 198.51.100.4',
    });

    expect(resolveClientIp(headers)).toBe('198.51.100.4');
  });

  it('usa la última entrada de x-forwarded-for, que añade la plataforma', () => {
    const headers = new Headers({ 'x-forwarded-for': ' 203.0.113.9, 198.51.100.4' });

    expect(resolveClientIp(headers)).toBe('198.51.100.4');
  });

  it('descarta una x-forwarded-for sin entradas útiles', () => {
    const headers = new Headers({
      'x-forwarded-for': ' , ',
      'cf-connecting-ip': '198.51.100.7',
    });

    expect(resolveClientIp(headers)).toBe('198.51.100.7');
  });

  it('recurre a cf-connecting-ip', () => {
    expect(resolveClientIp(new Headers({ 'cf-connecting-ip': '198.51.100.7' }))).toBe(
      '198.51.100.7'
    );
  });

  it('devuelve una clave común cuando no hay cabecera', () => {
    expect(resolveClientIp(new Headers())).toBe('unknown-ip');
  });
});
