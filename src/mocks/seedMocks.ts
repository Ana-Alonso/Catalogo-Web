import { mockCatalogItems } from './catalogMocks';
import { mockRegistrations } from './registrationMocks';
import { MOCK_SEED_VERSION, MOCK_STORAGE_KEYS } from './mockStorage';

export const seedMockData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (localStorage.getItem(MOCK_STORAGE_KEYS.seedVersion) === MOCK_SEED_VERSION) {
      return;
    }

    localStorage.setItem(
      MOCK_STORAGE_KEYS.products,
      JSON.stringify(mockCatalogItems)
    );
    localStorage.setItem(
      MOCK_STORAGE_KEYS.registrations,
      JSON.stringify(mockRegistrations)
    );
    localStorage.setItem(MOCK_STORAGE_KEYS.seedVersion, MOCK_SEED_VERSION);
  } catch {
    return;
  }
};
