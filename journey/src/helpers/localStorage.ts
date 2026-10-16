import type { Settings } from '../types/types';

interface StorageSchema {
  settings: Settings;
}

// Parsed JSON is not validated; the schema is a contract with whatever this app saved earlier.
export const getFromLocalStorage = <K extends keyof StorageSchema>(
  name: K,
): null | StorageSchema[K] => {
  const stored = localStorage.getItem(name);
  const parsed = stored ? (JSON.parse(stored) as StorageSchema[K]) : null;
  return parsed;
};

export const saveToLocalStorage = <K extends keyof StorageSchema>(
  name: K,
  data: StorageSchema[K],
) => {
  localStorage.setItem(name, JSON.stringify(data));
};
