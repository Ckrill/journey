// Helpers
import { YearMonthDay } from './categorizer';

export const getWorkoutsForDay = (
  date: { year: number; month: string; day: number },
  workoutsByYearMonthDay: YearMonthDay[]
) => {
  return (
    workoutsByYearMonthDay
      .find(({ year }) => year === date.year)
      ?.months.find(({ month }) => month === date.month)
      ?.days.find(({ day }) => day === date.day)?.workouts || []
  );
};
