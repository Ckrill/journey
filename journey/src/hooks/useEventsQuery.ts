// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { toEvent } from '../helpers/mappers';

// Hooks
import { useUserId } from './useUserId';

// Miscellaneous
import { pageSize, supabase } from '../lib/supabase';

// Types
import type { EventRow } from '../types/rows';
import type { Events } from '../types/types';

export const eventsKey = (userId: string) => ['events', userId] as const;

export const eventsQueryOptions = (userId: string) => ({
  queryFn: async (): Promise<Events> => {
    // Row-level security limits this to the user's own events. Pages are
    // fetched in order so the date/id sort keeps them stable.
    const rows: EventRow[] = [];

    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from('events')
        .select('id, habit_id, date')
        .order('date', { ascending: false })
        .order('id')
        .range(from, from + pageSize - 1);

      if (error) throw error;
      rows.push(...data);
      if (data.length < pageSize) break;
    }

    return rows.map((row) => toEvent(row));
  },
  queryKey: eventsKey(userId),
  staleTime: 30_000,
});

export const useEventsQuery = () => {
  return useSuspenseQuery(eventsQueryOptions(useUserId()));
};
