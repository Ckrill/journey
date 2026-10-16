// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { parseEvents } from '../helpers/dataHandler';
import { getAll } from '../helpers/requests';

// Contexts
import { useUser } from '../contexts/userContext';

// Types
import type {
  EventsContentful,
  HabitsContentful,
} from '../types/contentfulTypes';
import type { Events } from '../types/types';

export const eventsKey = (userId: string) => ['events', userId] as const;

export const eventsQueryOptions = (userId: string) => ({
  queryFn: async (): Promise<Events> => {
    // Events belong to habits, so scope them through the user's habits (active or archived).
    const habitsContentful = await getAll<HabitsContentful>(
      'habit',
      `&fields.user.sys.id=${userId}&select=sys.id`,
    );
    const habitIds = habitsContentful.items.map((habit) => habit.sys.id);
    if (habitIds.length === 0) return [];

    const eventsContentful = await getAll<EventsContentful>(
      'event',
      `&fields.habit.sys.id[in]=${habitIds.join(',')}`,
    );
    return parseEvents(eventsContentful);
  },
  queryKey: eventsKey(userId),
  staleTime: 30_000,
});

export const useEventsQuery = () => {
  const user = useUser();
  return useSuspenseQuery(eventsQueryOptions(user.id));
};
