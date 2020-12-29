// export const dateFormatter = (date:Date, country: string = 'en-US') => {
//   const weekday = date.toLocaleString(country, { weekday: 'long' }),
//     month = date.toLocaleString(country, { month: 'long' });
//   return (
//     weekday + ' ' + month + ' ' + date.getDate() + ', ' + date.getFullYear()
//   );
// };

export const getMonth = (date: Date, country: string = 'en-US') => {
  const month = date.toLocaleString(country, { month: 'long' });
  return month;
};

export const getMonthDay = (date: Date, country: string = 'en-US') => {
  const month = date.toLocaleString(country, { month: 'long' });
  return month + ' ' + date.getDate();
};

// export const getMonthDayYear = (date:Date, country: string = 'en-US') => {
//   const month = date.toLocaleString(country, { month: 'long' });
//   return month + ' ' + date.getDate() + ', ' + date.getFullYear();
// };

export const diffDays = (
  firstDate: number | string,
  secondDate: number | string
) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  return Math.round(
    Math.abs((Number(firstDate) - Number(secondDate)) / oneDay)
  );
};
