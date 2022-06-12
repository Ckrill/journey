// Helpers
import { YearMonthDay } from './categorizer';

export const getEventsForDay = (
  date: { year: number; month: string; day: number },
  eventsByYearMonthDay: YearMonthDay[]
) => {
  return (
    eventsByYearMonthDay
      .find(({ year }) => year === date.year)
      ?.months.find(({ month }) => month === date.month)
      ?.days.find(({ day }) => day === date.day)?.events || []
  );
};
