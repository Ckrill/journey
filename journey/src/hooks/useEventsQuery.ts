import { useQuery } from '@tanstack/react-query';

// Helpers
import { parseEvents } from '../helpers/dataHandler';
import { getAll } from '../helpers/requests';

// Types
import type { EventsContentful } from '../types/contentfulTypes';
import type { Events } from '../types/types';

export const eventsQueryOptions = {
  queryKey: ['events'] as const,
  queryFn: async (): Promise<Events> => {
    const data = await getAll<EventsContentful>('workout');
    return parseEvents(data);
  },
  staleTime: 30_000,
};

export const useEventsQuery = () => {
  return useQuery(eventsQueryOptions);
};
