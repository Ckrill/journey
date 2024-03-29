// Constants
import constants from '../settings/constants';

// Helpers
import { categorizeByYearMonthDay, YearMonthDay } from './categorizer';
import { addDays, getMonth } from './dateFormatting';
import { getEventsForDay } from './streak-helpers';

// Types
import { User, Events } from '../types/types';

// Leniency is the amount of days that can be skipped before the streak is broken.
const leniency = constants.leniency;

export const calculateStreak = (user: User | null, events: Events) => {
  if (!events.length) return { streak: 0, leniency: leniency };

  const myEvents = events.filter((item) => item.user?.id === user?.id);
  const eventsByYearMonthDay: YearMonthDay[] =
    categorizeByYearMonthDay(myEvents) || [];

  let today = new Date();
  // Start from today, count backwards.
  let date = new Date();

  // Leniency pool represents the potential for extra events.
  // Leniency pool + days accumulated can maximum be 3 (constants.leniency) at any given moment.
  let leniencyPool = leniency;

  // Days accumulated is the extra events, that can be used on a missed day (max 3 (constants.leniency) at any time).
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

    // Number of events on that day.
    const numberOfEvents =
      getEventsForDay(dateObj, eventsByYearMonthDay).length || 0;

    if (numberOfEvents) {
      // Event(s) found.

      // Update total days missed here because we don't want to update it if there is not a valid event after a missed day.
      totalDaysMissed = daysMissed;

      streak++;

      let extraEvents = numberOfEvents - 1;

      for (; extraEvents > 0; extraEvents--) {
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
      // Event not found.

      // If day is today, don't count it, because the day is not over yet.
      if (date.toISOString() === today.toISOString()) {
      } else if (daysAccumulated) {
        // If there is a streak cached.
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
