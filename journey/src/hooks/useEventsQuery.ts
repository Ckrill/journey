// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { parseEvents } from '../helpers/dataHandler';
import { getAll } from '../helpers/requests';

// Types
import type { EventsContentful } from '../types/contentfulTypes';
import type { Events } from '../types/types';

export const eventsQueryOptions = {
  queryFn: async (): Promise<Events> => {
    const data = await getAll<EventsContentful>('workout');
    return parseEvents(data);
  },
  queryKey: ['events'] as const,
  staleTime: 30_000,
};

export const useEventsQuery = () => {
  return useSuspenseQuery(eventsQueryOptions);
};
