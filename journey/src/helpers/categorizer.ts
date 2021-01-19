// Helpers
import { getMonth } from './dateFormatting';

// Types
import { Workouts } from '../types/types';

export type Year = { months: Month[]; year: number };
export type Month = { month: string; workouts: Workouts };

export type YearMonthDay = { months: MonthDay[]; year: number };
export type MonthDay = { days: Day[]; month: string };
export type Day = { day: number; workouts: Workouts };

export const categorizeByYearAndMonth = (workouts: Workouts) => {
  const workoutsByYear: Year[] = [];

  workouts.forEach((workout) => {
    const date = new Date(workout.date);
    const workoutYear = date.getFullYear();
    const workoutMonth = getMonth(date);

    // Templates
    const yearTemplate: Year = { months: [], year: workoutYear };
    const monthTemplate: Month = { month: workoutMonth, workouts: [] };

    // If the year does not exist, create it.
    const yearRef =
      workoutsByYear.find(({ year }) => year === workoutYear) ||
      workoutsByYear[workoutsByYear.push(yearTemplate) - 1];

    // If the month does not exist, create it.
    const monthRef =
      yearRef.months.find(({ month }) => month === workoutMonth) ||
      yearRef.months[yearRef.months.push(monthTemplate) - 1];

    // Add workout to the month.
    monthRef.workouts.push(workout);
  });

  return workoutsByYear;
};

export const categorizeByYearMonthDay = (workouts: Workouts) => {
  const workoutsByYear: YearMonthDay[] = [];

  workouts.forEach((workout) => {
    const date = new Date(workout.date);
    const workoutYear = date.getFullYear();
    const workoutMonth = getMonth(date);
    const workoutDay = date.getDate();

    // Templates
    const yearTemplate: YearMonthDay = { months: [], year: workoutYear };
    const monthTemplate: MonthDay = { days: [], month: workoutMonth };
    const dayTemplate: Day = { day: workoutDay, workouts: [] };

    // If the year does not exist, create it.
    const yearRef =
      workoutsByYear.find(({ year }) => year === workoutYear) ||
      workoutsByYear[workoutsByYear.push(yearTemplate) - 1];

    // If the month does not exist, create it.
    const monthRef =
      yearRef.months.find(({ month }) => month === workoutMonth) ||
      yearRef.months[yearRef.months.push(monthTemplate) - 1];

    // If the day does not exist, create it.
    const dayRef =
      monthRef.days.find(({ day }) => day === workoutDay) ||
      monthRef.days[monthRef.days.push(dayTemplate) - 1];

    // Add workout to the month.
    dayRef.workouts.push(workout);
  });

  return workoutsByYear;
};
