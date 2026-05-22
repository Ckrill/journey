// Helpers
import { formatDate } from './dateFormatting';

// Types
import type { Events } from '../types/types';

export type Year = { months: Month[]; year: number };
export type Month = { month: string; events: Events };

export const categorizeByYearAndMonth = (events: Events) => {
  const eventsByYear: Year[] = [];

  events.forEach((event) => {
    const date = new Date(event.date);
    const eventYear = date.getFullYear();
    const eventMonth = formatDate(date, 'month');

    // Templates
    const yearTemplate: Year = { months: [], year: eventYear };
    const monthTemplate: Month = { month: eventMonth, events: [] };

    // If the year does not exist, create it.
    const yearRef =
      eventsByYear.find(({ year }) => year === eventYear) ||
      eventsByYear[eventsByYear.push(yearTemplate) - 1];

    // If the month does not exist, create it.
    const monthRef =
      yearRef.months.find(({ month }) => month === eventMonth) ||
      yearRef.months[yearRef.months.push(monthTemplate) - 1];

    // Add event to the month.
    monthRef.events.push(event);
  });

  console.log('eventsByYear: ', eventsByYear);
  return eventsByYear;
};
