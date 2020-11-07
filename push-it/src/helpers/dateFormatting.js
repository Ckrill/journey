// export function dateFormatter(date, country) {
//   const weekday = date.toLocaleString(country, { weekday: 'long' }),
//     month = date.toLocaleString(country, { month: 'long' });
//   return (
//     weekday + ' ' + month + ' ' + date.getDate() + ', ' + date.getFullYear()
//   );
// }

export function getMonth(date, country) {
  const month = date.toLocaleString(country, { month: 'long' });
  return month;
}

export function getMonthDay(date, country) {
  const month = date.toLocaleString(country, { month: 'long' });
  return month + ' ' + date.getDate();
}

// export function getMonthDayYear(date, country) {
//   const month = date.toLocaleString(country, { month: 'long' });
//   return month + ' ' + date.getDate() + ', ' + date.getFullYear();
// }
