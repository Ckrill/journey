import { User, Workouts } from '../types/types';
import { diffDays } from './dateFormatting';

export const calculateStreak = (user: User | null, workouts: Workouts) => {
  if (!workouts.length) return 0;

  let earliestStreakDate = new Date().toDateString();

  const myWorkouts = workouts.filter((item) => item.user?.id === user?.id);

  myWorkouts.some((item) => {
    const date = new Date(item.date);
    const day = date.toDateString();

    const tomorrow = new Date(item.date);
    new Date(tomorrow.setDate(tomorrow.getDate() + 1));
    const tomorrowDay = tomorrow.toDateString();

    if (earliestStreakDate === day || earliestStreakDate === tomorrowDay) {
      earliestStreakDate = day;

      // Keep counting
      return false;
    } else {
      // Stop the count!
      return true;
    }
  });

  const today = new Date();
  const streak = diffDays(Number(new Date(earliestStreakDate)), Number(today));

  return streak;

  // TODO: Use latests workout date to calculate if the streak is valid.
  // Return early if the latest date is not today or yesterday.
};
