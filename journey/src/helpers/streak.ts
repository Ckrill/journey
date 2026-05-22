// Types
import type { User, Events } from '../types/types';

/** Maximum allowed gap (in days) between consecutive event dates before the streak breaks */
const STREAK_LENIENCY_DAYS = 3;

/** Returns the number of days between two ISO date strings */
const daysBetween = (dateA: string, dateB: string) => {
  return Temporal.PlainDate.from(dateA).until(dateB).total('days');
};

/**
 * Calculates the current streak length for a user.
 * Returns `hitBoundary: true` when the streak spans all available data,
 * signalling that a larger window of events may be needed.
 */
export const calculateStreak = (user: User | null, events: Events) => {
  if (!user) return { streak: 0, daysSinceLast: 0, hitBoundary: false };

  // Unique dates for this user, sorted descending
  const userEvents = events.filter((e) => e.user.id === user.id);
  const uniqueDates = [...new Set(userEvents.map((e) => e.date))];
  const sortedDates = uniqueDates.sort((a, b) => (a > b ? -1 : 1));

  if (!sortedDates.length)
    return { streak: 0, daysSinceLast: 0, hitBoundary: false };

  const latestEventDate = sortedDates[0];
  const today = Temporal.Now.plainDateISO().toString();
  const daysSinceLast = daysBetween(latestEventDate, today);

  // Streak already broken
  if (daysSinceLast > STREAK_LENIENCY_DAYS)
    return { streak: 0, daysSinceLast, hitBoundary: false };

  // Walk consecutive pairs — break on first gap > STREAK_LENIENCY_DAYS
  let streak = 1;
  let hitBoundary = true;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    if (
      daysBetween(sortedDates[i + 1], sortedDates[i]) > STREAK_LENIENCY_DAYS
    ) {
      hitBoundary = false;
      break;
    }
    streak++;
  }

  return { streak, daysSinceLast, hitBoundary };
};
