// Constants
import constants from '../settings/constants';

// Helpers
import { User, Workouts } from '../types/types';
import { addDays, getMonth } from './dateFormatting';
import { getWorkoutsForDay } from './streak-helpers';

// Leniency is the amount of days that can be skipped before the streak is broken.
const leniency = constants.leniency;

export const calculateStreak = (user: User | null, workouts: Workouts) => {
  if (!workouts.length) return { streak: 0, leniency: leniency };

  const myWorkouts = workouts.filter((item) => item.user?.id === user?.id);

  // Start from today, count backwards.
  let date = new Date();

  // Leniency pool represents the potential for extra workouts.
  // Leniency pool + days accumulated can maximum be 3 (constants.leniency) at any given moment.
  let leniencyPool = leniency;

  // Days accumulated is the extra workouts, that can be used on a missed day (max 3 (constants.leniency) at any time).
  let daysAccumulated = 0;

  let daysMissed = 0;
  let totalDaysMissed = 0;
  let streak = 0;

  // Counter - Start from today and go back as long as the streak goes on.
  // When leniency pool and days accumulated is used, stop the loop.
  for (; leniencyPool + daysAccumulated >= 0; ) {
    // The day.
    const dateObj = {
      year: date.getFullYear(),
      month: getMonth(date),
      day: date.getDate(),
    };

    // Number of workouts on that day.
    const numberOfWorkouts = getWorkoutsForDay(dateObj, myWorkouts).length || 0;

    if (numberOfWorkouts) {
      // Workout(s) found.

      // Update total days missed here because we don't want to update it if there is not a valid workout after a missed day.
      totalDaysMissed = daysMissed;

      streak++;

      let extraWorkouts = numberOfWorkouts - 1;

      for (; extraWorkouts > 0; extraWorkouts--) {
        // Add 1 to daysAccumulated.
        daysAccumulated++;
        if (daysAccumulated + leniencyPool > leniency) {
          leniencyPool--;
          leniencyPool = Math.max(leniencyPool, 0);
        }
      }

      // Cap daysAccumulated.
      daysAccumulated = Math.min(daysAccumulated, leniency);
    } else {
      // Workout not found.

      // If there is a streak cached.
      if (daysAccumulated) {
        // Realize the daysAccumulated.
        streak++;
        daysAccumulated--;
      } else {
        // Else add 1 to daysMissed
        daysMissed++;

        // Missed a day, remove 1 from leniency pool.
        leniencyPool--;
      }
    }

    // Go to previous day
    date = addDays(date, -1);
  }

  return { streak: streak, leniency: totalDaysMissed };
};
