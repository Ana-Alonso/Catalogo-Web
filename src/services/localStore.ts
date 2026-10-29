const readStored = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const writeStored = (key: string, items: unknown[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    return;
  }
};

export interface LocalStore<T> {
  read: () => T[];
  write: (items: T[]) => void;
}

export const createLocalStore = <T>(key: string): LocalStore<T> => ({
  read: () => readStored<T>(key),
  write: (items) => writeStored(key, items),
});
