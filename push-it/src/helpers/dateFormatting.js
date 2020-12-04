// export const dateFormatter = (date, country) => {
//   const weekday = date.toLocaleString(country, { weekday: 'long' }),
//     month = date.toLocaleString(country, { month: 'long' });
//   return (
//     weekday + ' ' + month + ' ' + date.getDate() + ', ' + date.getFullYear()
//   );
// };

export const getMonth = (date, country) => {
  const month = date.toLocaleString(country, { month: 'long' });
  return month;
};

export const getMonthDay = (date, country) => {
  const month = date.toLocaleString(country, { month: 'long' });
  return month + ' ' + date.getDate();
};

// export const getMonthDayYear = (date, country) => {
//   const month = date.toLocaleString(country, { month: 'long' });
//   return month + ' ' + date.getDate() + ', ' + date.getFullYear();
// };

export const diffDays = (firstDate, seconDate) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  return Math.round(Math.abs((Number(firstDate) - Number(seconDate)) / oneDay));
};
