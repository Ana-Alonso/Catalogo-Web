import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from './i18n';

class IntersectionObserverStub {
  root = null;
  rootMargin = '';
  threshold = 0;

  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}

  takeRecords(): never[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

beforeEach(async () => {
  await i18n.changeLanguage('es');
});

afterEach(() => {
  cleanup();
});
