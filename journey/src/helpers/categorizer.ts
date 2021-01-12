// Helpers
import { getMonth } from './dateFormatting';

// Types
import { Workouts } from '../types/types';

export type Year = { months: Month[]; year: number };
export type Month = { month: string; workouts: Workouts };

export const categorizeByYearAndMonth = (workouts: Workouts) => {
  const workoutsByYear: Year[] = [];

  workouts.forEach((workout) => {
    const workoutYear = new Date(workout.date).getFullYear();
    const workoutMonth = getMonth(new Date(workout.date));

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
