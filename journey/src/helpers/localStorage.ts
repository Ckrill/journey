import type { Settings } from '../types/types';

// Settings are kept per account, so signing out doesn't have to erase them.
type StorageSchema = Record<`settings:${string}`, Settings>;

export const settingsKey = (userId: string) => `settings:${userId}` as const;

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
