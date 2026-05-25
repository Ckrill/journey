// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getFromLocalStorage = <T>(name: string): null | T => {
  const stored = localStorage.getItem(name);
  const parsed = stored ? (JSON.parse(stored) as T) : null;
  return parsed;
};

export const saveToLocalStorage = (
  name: string,
  data: { [name: string]: boolean | number | string },
) => {
  const stringified = JSON.stringify(data);
  localStorage.setItem(name, stringified);
};
