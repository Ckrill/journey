// Constants
import constants from '../settings/constants';

// Helpers
import { User, Workouts } from '../types/types';
import { categorizeByYearMonthDay, YearMonthDay } from './categorizer';
import { addDays, getMonth } from './dateFormatting';

// Leniency is the amount of days that can be skipped before the streak is broken.
const leniency = constants.leniency;

export const calculateStreak = (user: User | null, workouts: Workouts) => {
  if (!workouts.length) return { streak: 0, leniency: leniency };

  const myWorkouts = workouts.filter((item) => item.user?.id === user?.id);

  const workoutsByYearMonthDay: YearMonthDay[] =
    categorizeByYearMonthDay(myWorkouts) || [];

  // Start from today, count backwards.
  let date = new Date();

  let leniencyRealized = leniency;
  let leniencyDebt = 0;
  let streak2 = 0;

  // Counter - Start from today and go back as long as the streak goes on.
  // When leniency is 0 stop the loop.
  for (let i = leniency; i > 0; ) {
    const counterYear = date.getFullYear();
    const counterMonth = getMonth(date);
    const counterDay = date.getDate();

    // Workouts on counterDay.
    const workouts = workoutsByYearMonthDay
      .find(({ year }) => year === counterYear)
      ?.months.find(({ month }) => month === counterMonth)
      ?.days.find(({ day }) => day === counterDay)?.workouts;

    // Number of workouts on counterDay.
    const numberOfWorkouts = workouts?.length || 0;

    if (numberOfWorkouts) {
      // Workout(s) are found.
      // Add 1 to streak
      streak2++;

      // If leniency is not max, it if possible that it should be bumped up.
      if (i < leniency) {
        const extraWorkouts = numberOfWorkouts - 1;
        // If there are more than 1 workout on counterDay restore leniency.
        i += extraWorkouts;

        // If there are more than 1 workout on counterDay add extra to streak.
        streak2 = streak2 + extraWorkouts;

        leniencyDebt += -extraWorkouts;
      }
      // Realize the debt (only realize dept when a workout comes after the dept).
      leniencyRealized += -leniencyDebt;
      leniencyDebt = 0;
    } else {
      // Workout not found.
      // Subract 1 from leniency.
      i--;

      // Add one to leniencyDebt
      leniencyDebt++;
    }

    date = addDays(date, -1);
  }

  return { streak: streak2, leniency: leniencyRealized };
};
