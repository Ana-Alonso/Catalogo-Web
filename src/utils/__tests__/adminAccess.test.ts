import { describe, expect, it } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { canUseDemoAccess, isAdminUser } from '../adminAccess';

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'ana@example.com',
  app_metadata: {},
  user_metadata: {},
  created_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('isAdminUser', () => {
  it('devuelve false cuando no hay usuario', () => {
    expect(isAdminUser(null)).toBe(false);
  });

  it('devuelve false sin rol en los metadatos', () => {
    expect(isAdminUser(buildUser())).toBe(false);
  });

  it('acepta el rol admin del app_metadata', () => {
    expect(
      isAdminUser(buildUser({ app_metadata: { role: 'admin' } }))
    ).toBe(true);
  });

  it('ignora el rol admin escrito por el propio usuario', () => {
    expect(
      isAdminUser(buildUser({ user_metadata: { role: 'admin' } }))
    ).toBe(false);
  });

  it('rechaza roles distintos de admin', () => {
    expect(
      isAdminUser(buildUser({ app_metadata: { role: 'editor' } }))
    ).toBe(false);
  });

  it('rechaza metadatos que no son objetos', () => {
    expect(
      isAdminUser(buildUser({ app_metadata: null as unknown as User['app_metadata'] }))
    ).toBe(false);
  });
});

describe('canUseDemoAccess', () => {
  it('permite la demo solo con mocks en desarrollo', () => {
    expect(canUseDemoAccess(true, true)).toBe(true);
  });

  it('bloquea la demo en una build de producción', () => {
    expect(canUseDemoAccess(true, false)).toBe(false);
  });

  it('bloquea la demo sin mocks', () => {
    expect(canUseDemoAccess(false, true)).toBe(false);
    expect(canUseDemoAccess(false, false)).toBe(false);
  });
});
