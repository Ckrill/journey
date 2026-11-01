// External
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Utilities
import { toRetroReminder } from '../helpers/mappers';

// Hooks
import { retroReminderKey } from './useRetroReminderQuery';
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { RetroReminder } from '../types/types';

/** Creates, updates, and removes the retro reminder. */
export const useRetroReminderMutations = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  /* eslint-disable perfectionist/sort-objects */
  const save = useMutation<
    RetroReminder,
    Error,
    Pick<RetroReminder, 'time' | 'weekday'>
  >({
    retry: false,
    mutationFn: async ({ time, weekday }) => {
      // user_id fills itself in from the signed-in user.
      const { data, error } = await supabase
        .from('reminders')
        .upsert(
          {
            kind: 'retro',
            // Clearing this lets a changed time still fire today.
            last_sent_on: null,
            remind_time: time,
            timezone: Temporal.Now.timeZoneId(),
            weekday,
          },
          { onConflict: 'user_id,kind' },
        )
        .select('weekday, remind_time, timezone')
        .single();

      if (error) throw error;
      return toRetroReminder(data);
    },
    onSuccess: (reminder) => {
      queryClient.setQueryData(retroReminderKey(userId), reminder);
    },
  });

  const remove = useMutation<undefined, Error, undefined>({
    retry: false,
    mutationFn: async () => {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('kind', 'retro');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(retroReminderKey(userId), null);
    },
  });
  /* eslint-enable perfectionist/sort-objects */

  return { remove, save };
};
