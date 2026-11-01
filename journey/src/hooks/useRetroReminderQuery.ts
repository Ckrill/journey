// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { toRetroReminder } from '../helpers/mappers';

// Hooks
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { RetroReminder } from '../types/types';

/**
 * Cache key for the user's retro reminder.
 * @param userId The signed-in user's id, so accounts never share a cache entry.
 */
export const retroReminderKey = (userId: string) =>
  ['retro-reminder', userId] as const;

/**
 * Query options for the user's retro reminder.
 * @param userId The signed-in user's id.
 */
export const retroReminderQueryOptions = (userId: string) => ({
  // Null when the user has no retro reminder.
  queryFn: async (): Promise<null | RetroReminder> => {
    const { data, error } = await supabase
      .from('reminders')
      .select('weekday, remind_time, timezone')
      .eq('kind', 'retro')
      .maybeSingle();

    if (error) throw error;
    return data ? toRetroReminder(data) : null;
  },
  queryKey: retroReminderKey(userId),
  staleTime: 30_000,
});

/**
 * Reads the user's retro reminder, suspending until it has loaded.
 * @returns The suspense query result; its data is null when no reminder is set.
 */
export const useRetroReminderQuery = () => {
  return useSuspenseQuery(retroReminderQueryOptions(useUserId()));
};
