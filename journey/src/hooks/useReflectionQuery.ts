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

export const reflectionKey = (userId: string) =>
  ['reflection', userId] as const;

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

export const useReflectionQuery = () => {
  return useSuspenseQuery(reflectionQueryOptions(useUserId()));
};
