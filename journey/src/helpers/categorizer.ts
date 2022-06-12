// Helpers
import { getMonth } from './dateFormatting';

// Types
import { Events } from '../types/types';

export type Year = { months: Month[]; year: number };
export type Month = { month: string; events: Events };

export type YearMonthDay = { months: MonthDay[]; year: number };
export type MonthDay = { days: Day[]; month: string };
export type Day = { day: number; events: Events };

export const categorizeByYearAndMonth = (events: Events) => {
  const eventsByYear: Year[] = [];

  events.forEach((event) => {
    const date = new Date(event.date);
    const eventYear = date.getFullYear();
    const eventMonth = getMonth(date);

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

  return eventsByYear;
};

export const categorizeByYearMonthDay = (events: Events) => {
  const eventsByYear: YearMonthDay[] = [];

  events.forEach((event) => {
    const date = new Date(event.date);
    const eventYear = date.getFullYear();
    const eventMonth = getMonth(date);
    const eventDay = date.getDate();

    // Templates
    const yearTemplate: YearMonthDay = { months: [], year: eventYear };
    const monthTemplate: MonthDay = { days: [], month: eventMonth };
    const dayTemplate: Day = { day: eventDay, events: [] };

    // If the year does not exist, create it.
    const yearRef =
      eventsByYear.find(({ year }) => year === eventYear) ||
      eventsByYear[eventsByYear.push(yearTemplate) - 1];

    // If the month does not exist, create it.
    const monthRef =
      yearRef.months.find(({ month }) => month === eventMonth) ||
      yearRef.months[yearRef.months.push(monthTemplate) - 1];

    // If the day does not exist, create it.
    const dayRef =
      monthRef.days.find(({ day }) => day === eventDay) ||
      monthRef.days[monthRef.days.push(dayTemplate) - 1];

    // Add event to the month.
    dayRef.events.push(event);
  });

  return eventsByYear;
};
