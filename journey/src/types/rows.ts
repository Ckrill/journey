import type { Tables } from './database.types';

// Row shapes come from the generated database types (yarn gen:types).

export type HabitRow = Omit<Tables<'habits'>, 'user_id'>;

export type EventRow = Pick<Tables<'events'>, 'date' | 'habit_id' | 'id'>;

export type ReflectionRow = Pick<
  Tables<'reflections'>,
  'blockers' | 'next_steps' | 'plan' | 'went_well'
>;
