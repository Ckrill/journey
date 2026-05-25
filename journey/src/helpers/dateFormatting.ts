/** Formats a date by the given granularity: "January", "January 1", or "January 1, 2026" */
export const formatDate = (date: Date, format: 'month' | 'monthDay') => {
  const locale: string = 'en-US';
  const formattedDate = date.toLocaleDateString(locale, {
    day: format !== 'month' ? 'numeric' : undefined,
    month: 'long',
  });
  return formattedDate;
};
