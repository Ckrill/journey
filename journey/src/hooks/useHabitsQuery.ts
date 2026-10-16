// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { toHabit } from '../helpers/mappers';

// Hooks
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { HabitRow } from '../types/rows';
import type { Habits } from '../types/types';

export const habitsKey = (userId: string) => ['habits', userId] as const;

export const habitsQueryOptions = (userId: string) => ({
  queryFn: async (): Promise<Habits> => {
    // Row-level security limits this to the user's own active habits, oldest
    // first (createdAt is the streak-order tiebreaker).
    const { data, error } = await supabase
      .from('habits')
      .select('id, name, planned_days, active, created_at')
      .eq('active', true)
      .order('created_at')
      .overrideTypes<HabitRow[], { merge: false }>();

    if (error) throw error;
    return data.map((row) => toHabit(row));
  },
  queryKey: habitsKey(userId),
  staleTime: 30_000,
});

export const useHabitsQuery = () => {
  return useSuspenseQuery(habitsQueryOptions(useUserId()));
};
