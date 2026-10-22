// Utilities
import { WEEKDAYS } from './week';

// Types
import type { Events, Habit } from '../types/types';

interface HabitWeekSummary {
  completed: number;
  /** Per weekday (Mon→Sun): whether the habit was done that day. */
  days: boolean[];
  habit: Habit;
  met: boolean;
  /** Planned days that were not completed (weekday indexes, Mon = 0). */
  missedPlannedDays: number[];
}

export interface WeekSummary {
  habits: HabitWeekSummary[];
  metCount: number;
  totalCheckIns: number;
}

/** Summarizes how each habit went across the given week (Mon→Sun dates). */
export const summarizeWeek = (
  habits: Habit[],
  events: Events,
  dates: string[],
): WeekSummary => {
  const inWeek = new Set(dates);
  const doneByHabit = new Map<string, Set<string>>();
  for (const event of events) {
    if (!inWeek.has(event.date)) continue;
    let set = doneByHabit.get(event.habitId);
    if (!set) {
      set = new Set<string>();
      doneByHabit.set(event.habitId, set);
    }
    set.add(event.date);
  }

  const summaries = [...habits]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    // Habits created after the week ended have nothing to report.
    .filter((habit) => habit.createdAt.slice(0, 10) <= dates[6])
    .map((habit): HabitWeekSummary => {
      const done = doneByHabit.get(habit.id);
      const days = dates.map((date) => done?.has(date) ?? false);
      const completed = days.filter(Boolean).length;
      const missedPlannedDays = WEEKDAYS.flatMap((day, index) =>
        habit.plannedDays.includes(day) && !days[index] ? [index] : [],
      );

      return {
        completed,
        days,
        habit,
        met: completed >= habit.weeklyTarget,
        missedPlannedDays,
      };
    });

  return {
    habits: summaries,
    metCount: summaries.filter((summary) => summary.met).length,
    totalCheckIns: summaries.reduce((sum, item) => sum + item.completed, 0),
  };
};
