import type { Weekday } from './types';

// Shapes of the rows in supabase/schema.sql.

export interface HabitRow {
  active: boolean;
  created_at: string;
  id: string;
  name: string;
  planned_days: Weekday[];
}

export interface EventRow {
  date: string;
  habit_id: string;
  id: string;
}
