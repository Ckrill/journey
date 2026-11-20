// Utilities
import { countEventsPerWeek } from './week';

// Types
import type { Events, Habit } from '../types/types';

/**
 * Counts the weeks in which a habit hit its weeklyTarget, live from events.
 * The weeks don't need to be consecutive.
 */
export const countCompletedWeeks = (habit: Habit, events: Events): number => {
  const dates = events
    .filter((event) => event.habitId === habit.id)
    .map((event) => event.date);

  let count = 0;
  for (const eventCount of countEventsPerWeek(dates).values()) {
    if (eventCount >= habit.weeklyTarget) count++;
  }
  return count;
};
