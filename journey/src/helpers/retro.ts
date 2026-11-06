// Utilities
import { WEEKDAYS } from './week';

// Types
import type { Events, Habit, Weekday } from '../types/types';

interface HabitWeekSummary {
  completed: number;
  /** Weekdays on which the habit was done. */
  completedDays: Weekday[];
  habit: Habit;
  met: boolean;
}

export interface WeekSummaryData {
  habits: HabitWeekSummary[];
  metCount: number;
}

/** Summarizes how each habit went across the given week (Mon→Sun dates). */
export const summarizeWeek = (
  habits: Habit[],
  events: Events,
  dates: string[],
): WeekSummaryData => {
  const weekdayByDate = new Map(
    dates.map((date, index): [string, Weekday] => [date, WEEKDAYS[index]]),
  );
  const doneByHabit = new Map<string, Set<Weekday>>();
  for (const event of events) {
    const weekday = weekdayByDate.get(event.date);
    if (!weekday) continue;
    let set = doneByHabit.get(event.habitId);
    if (!set) {
      set = new Set<Weekday>();
      doneByHabit.set(event.habitId, set);
    }
    set.add(weekday);
  }

  const summaries = habits
    .toSorted((a, b) => a.createdAt.localeCompare(b.createdAt))
    // Habits created after the week ended have nothing to report.
    .filter((habit) => habit.createdAt.slice(0, 10) <= dates[6])
    .map((habit): HabitWeekSummary => {
      const done = doneByHabit.get(habit.id);
      const completedDays = WEEKDAYS.filter((day) => done?.has(day) ?? false);
      const completed = completedDays.length;

      return {
        completed,
        completedDays,
        habit,
        met: completed >= habit.weeklyTarget,
      };
    });

  return {
    habits: summaries,
    metCount: summaries.filter((summary) => summary.met).length,
  };
};
