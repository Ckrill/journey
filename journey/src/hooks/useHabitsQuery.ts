// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { toHabit } from '../helpers/mappers';

// Hooks
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { Habits } from '../types/types';

/**
 * Cache key for the user's active habits.
 * @param userId The signed-in user's id, so accounts never share a cache entry.
 */
export const habitsKey = (userId: string) => ['habits', userId] as const;

/**
 * Query options for the user's active habits, oldest first.
 * @param userId The signed-in user's id.
 */
export const habitsQueryOptions = (userId: string) => ({
  queryFn: async (): Promise<Habits> => {
    // Row-level security limits this to the user's own active habits, oldest
    // first (createdAt is the streak-order tiebreaker).
    const { data, error } = await supabase
      .from('habits')
      .select(
        'id, name, planned_days, weekly_target, goal_description, goal_months, active, created_at',
      )
      .eq('active', true)
      .order('created_at');

    if (error) throw error;
    return data.map((row) => toHabit(row));
  },
  queryKey: habitsKey(userId),
  staleTime: 30_000,
});

/**
 * Reads the user's active habits, suspending until they have loaded.
 * @returns The suspense query result holding the habits.
 */
export const useHabitsQuery = () => {
  return useSuspenseQuery(habitsQueryOptions(useUserId()));
};
