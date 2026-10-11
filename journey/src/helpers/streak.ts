// Utilities
import { countEventsPerWeek, currentWeekStart, shiftWeek } from './week';

// Types
import type { Events, Habit } from '../types/types';

export interface HabitStreak {
  /** Longest run of consecutive met weeks anywhere in history. */
  best: number;
  /** Consecutive met weeks up to (and including) the current week. */
  current: number;
}

/**
 * Computes the current and best weekly streak for a habit, live from events.
 *
 * A week "hits" when its event count >= the habit's weeklyTarget. The current
 * week is forgiving: if not yet met it neither counts nor breaks the streak
 * (it's still "in progress").
 */
export const calculateStreak = (habit: Habit, events: Events): HabitStreak => {
  const dates = events
    .filter((event) => event.habitId === habit.id)
    .map((event) => event.date);

  const perWeek = countEventsPerWeek(dates);
  const target = habit.weeklyTarget;
  const isMet = (week: string) => (perWeek.get(week) ?? 0) >= target;

  // Current streak: walk backwards from this week.
  const thisWeek = currentWeekStart();
  let current = 0;
  // Skip the current week if it isn't met yet (in progress, not a break).
  let cursor = isMet(thisWeek) ? thisWeek : shiftWeek(thisWeek, -1);
  while (isMet(cursor)) {
    current++;
    cursor = shiftWeek(cursor, -1);
  }

  // Best streak: scan all met weeks, find the longest consecutive run.
  const weeks = [...perWeek.keys()].filter(isMet).sort();
  let best = 0;
  let run = 0;
  let previous: null | string = null;
  for (const week of weeks) {
    run = previous !== null && shiftWeek(previous, 1) === week ? run + 1 : 1;
    if (run > best) best = run;
    previous = week;
  }

  return { best: Math.max(best, current), current };
};

/** The best streak across every habit (overall personal record). */
export const overallBestStreak = (habits: Habit[], events: Events): number => {
  return habits.reduce(
    (max, habit) => Math.max(max, calculateStreak(habit, events).best),
    0,
  );
};
