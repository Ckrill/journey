// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { toReflection } from '../helpers/mappers';

// Hooks
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { Reflection } from '../types/types';

/**
 * Cache key for the user's reflection.
 * @param userId The signed-in user's id, so accounts never share a cache entry.
 */
export const reflectionKey = (userId: string) =>
  ['reflection', userId] as const;

/**
 * Query options for the user's latest reflection.
 * @param userId The signed-in user's id.
 */
export const reflectionQueryOptions = (userId: string) => ({
  // Null until the first reflection is saved.
  queryFn: async (): Promise<null | Reflection> => {
    const { data, error } = await supabase
      .from('reflections')
      .select('went_well, blockers, next_steps, plan')
      .maybeSingle();

    if (error) throw error;
    return data ? toReflection(data) : null;
  },
  queryKey: reflectionKey(userId),
  staleTime: 30_000,
});

/**
 * Reads the user's latest reflection, suspending until it has loaded.
 * @returns The suspense query result; its data is null before the first save.
 */
export const useReflectionQuery = () => {
  return useSuspenseQuery(reflectionQueryOptions(useUserId()));
};
