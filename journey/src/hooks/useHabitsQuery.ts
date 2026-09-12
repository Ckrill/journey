// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { parseHabits } from '../helpers/dataHandler';
import { getAll } from '../helpers/requests';

// Types
import type { HabitsContentful } from '../types/contentfulTypes';
import type { Habits } from '../types/types';

export const habitsQueryOptions = {
  queryFn: async (): Promise<Habits> => {
    // Active habits only, oldest first (createdAt is the streak-order tiebreaker).
    const data = await getAll<HabitsContentful>(
      'habit',
      '&fields.active=true&order=sys.createdAt',
    );

    return parseHabits(data);
  },
  queryKey: ['habits'] as const,
  staleTime: 30_000,
};

export const useHabitsQuery = () => {
  return useSuspenseQuery(habitsQueryOptions);
};
