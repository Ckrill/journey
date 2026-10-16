// External
import { useSuspenseQuery } from '@tanstack/react-query';

// Utilities
import { parseHabits } from '../helpers/dataHandler';
import { getAll } from '../helpers/requests';

// Contexts
import { useUser } from '../contexts/userContext';

// Types
import type { HabitsContentful } from '../types/contentfulTypes';
import type { Habits } from '../types/types';

export const habitsKey = (userId: string) => ['habits', userId] as const;

export const habitsQueryOptions = (userId: string) => ({
  queryFn: async (): Promise<Habits> => {
    // The user's active habits, oldest first (createdAt is the streak-order tiebreaker).
    const habitsContentful = await getAll<HabitsContentful>(
      'habit',
      `&fields.user.sys.id=${userId}&fields.active=true&order=sys.createdAt`,
    );

    return parseHabits(habitsContentful);
  },
  queryKey: habitsKey(userId),
  staleTime: 30_000,
});

export const useHabitsQuery = () => {
  const user = useUser();
  return useSuspenseQuery(habitsQueryOptions(user.id));
};
