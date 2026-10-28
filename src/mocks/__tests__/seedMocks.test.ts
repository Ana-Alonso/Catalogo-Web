import { beforeEach, describe, expect, it } from 'vitest';
import { seedMockData } from '../seedMocks';
import { MOCK_SEED_VERSION, MOCK_STORAGE_KEYS } from '../mockStorage';
import { mockCatalogItems } from '../catalogMocks';
import { mockRegistrations } from '../registrationMocks';

const readProducts = (): unknown[] =>
  JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.products) ?? '[]');

const readRegistrations = (): unknown[] =>
  JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.registrations) ?? '[]');

describe('seedMockData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('escribe productos e inscripciones la primera vez', () => {
    seedMockData();

    expect(readProducts()).toHaveLength(mockCatalogItems.length);
    expect(readRegistrations()).toHaveLength(mockRegistrations.length);
    expect(localStorage.getItem(MOCK_STORAGE_KEYS.seedVersion)).toBe(
      MOCK_SEED_VERSION
    );
  });

  it('no sobrescribe los datos si la versión ya coincide', () => {
    seedMockData();
    localStorage.setItem(MOCK_STORAGE_KEYS.products, '[]');

    seedMockData();

    expect(readProducts()).toHaveLength(0);
  });

  it('vuelve a sembrar cuando cambia la versión del seed', () => {
    localStorage.setItem(MOCK_STORAGE_KEYS.products, '[]');
    localStorage.setItem(MOCK_STORAGE_KEYS.seedVersion, 'version-antigua');

    seedMockData();

    expect(readProducts()).toHaveLength(mockCatalogItems.length);
    expect(localStorage.getItem(MOCK_STORAGE_KEYS.seedVersion)).toBe(
      MOCK_SEED_VERSION
    );
  });
});
