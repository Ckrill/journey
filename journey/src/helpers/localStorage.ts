export const getFromLocalStorage = (name: string) => {
  return JSON.parse(localStorage[name] || null) || null;
};

export const saveToLocalStorage = (name: string, data: any) => {
  // name.obj = data;
  // localStorage[name] = JSON.stringify(name);
  console.log('localStorage[name]: ', localStorage[name]);
  console.log('data: ', data);
  localStorage[name] = JSON.stringify(data);
};
