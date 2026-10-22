// External
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Utilities
import { toReflection } from '../helpers/mappers';

// Hooks
import { reflectionKey } from './useReflectionQuery';
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { Reflection } from '../types/types';

/** Saves the reflection, replacing the previous one. */
export const useSaveReflection = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  /* eslint-disable perfectionist/sort-objects */
  return useMutation<Reflection, Error, Reflection>({
    retry: false,
    mutationFn: async ({ blockers, nextSteps, plan, wentWell }) => {
      // user_id fills itself in from the signed-in user.
      const { data, error } = await supabase
        .from('reflections')
        .upsert(
          {
            blockers,
            next_steps: nextSteps,
            plan,
            updated_at: new Date().toISOString(),
            went_well: wentWell,
          },
          { onConflict: 'user_id' },
        )
        .select('went_well, blockers, next_steps, plan')
        .single();

      if (error) throw error;
      return toReflection(data);
    },
    onSuccess: (reflection) => {
      queryClient.setQueryData(reflectionKey(userId), reflection);
    },
  });
  /* eslint-enable perfectionist/sort-objects */
};
