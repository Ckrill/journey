// Types
import type { EventRow, HabitRow } from '../types/rows';
import type { Event, Habit } from '../types/types';

export const toHabit = (row: HabitRow): Habit => ({
  active: row.active,
  createdAt: row.created_at,
  id: row.id,
  name: row.name,
  plannedDays: row.planned_days,
  weeklyTarget: row.planned_days.length,
});

export const toEvent = (row: EventRow): Event => ({
  date: row.date,
  habitId: row.habit_id,
  id: row.id,
});
