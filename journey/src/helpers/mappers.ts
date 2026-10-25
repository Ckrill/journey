// Types
import type { EventRow, HabitRow, ReflectionRow } from '../types/rows';
import type { Event, Habit, Reflection } from '../types/types';

export const toHabit = (row: HabitRow): Habit => ({
  active: row.active,
  createdAt: row.created_at,
  goalDescription: row.goal_description,
  goalMonths: row.goal_months,
  id: row.id,
  name: row.name,
  plannedDays: row.planned_days,
  weeklyTarget: row.weekly_target,
});

export const toEvent = (row: EventRow): Event => ({
  date: row.date,
  habitId: row.habit_id,
  id: row.id,
});

export const toReflection = (row: ReflectionRow): Reflection => ({
  blockers: row.blockers,
  nextSteps: row.next_steps,
  plan: row.plan,
  wentWell: row.went_well,
});
