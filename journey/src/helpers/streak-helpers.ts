// Helpers
import { categorizeByYearMonthDay, YearMonthDay } from './categorizer';

// Types
import { Workout } from '../types/types';

export const getWorkoutsForDay = (
  date: { year: number; month: string; day: number },
  myWorkouts: Workout[]
) => {
  const workoutsByYearMonthDay: YearMonthDay[] =
    categorizeByYearMonthDay(myWorkouts) || [];

  return (
    workoutsByYearMonthDay
      .find(({ year }) => year === date.year)
      ?.months.find(({ month }) => month === date.month)
      ?.days.find(({ day }) => day === date.day)?.workouts || []
  );
};
