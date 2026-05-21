// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getFromLocalStorage = <T>(name: string): T | null => {
  const stored = localStorage.getItem(name);
  const parsed = stored ? (JSON.parse(stored) as T) : null;
  return parsed;
};

export const saveToLocalStorage = (
  name: string,
  data: { [name: string]: string | number | boolean },
) => {
  const stringified = JSON.stringify(data);
  localStorage.setItem(name, stringified);
};
