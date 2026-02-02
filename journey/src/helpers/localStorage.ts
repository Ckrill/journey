export const getFromLocalStorage = (name: string) => {
  return JSON.parse(localStorage[name] || null) || null;
};

export const saveToLocalStorage = (
  name: string,
  data: { [name: string]: string | number },
) => {
  // name.obj = data;
  // localStorage[name] = JSON.stringify(name);
  localStorage[name] = JSON.stringify(data);
};
