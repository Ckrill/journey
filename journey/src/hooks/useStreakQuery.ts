// External
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Utilities
import { calculateStreak } from '../helpers/streak';
import { fetchStreak } from '../helpers/streakFetch';
import { persistStreak } from '../helpers/streakPersist';

// Contexts
import { useUser, useUserUpdate } from '../contexts/userContext';

// Types
import type { Events } from '../types/types';

type Streak = { daysSinceLast: number; streak: number };

const STREAK_QUERY_KEY = ['streak'] as const;

export const useStreakQuery = () => {
  const user = useUser();

  return useQuery<Streak>({
    enabled: !!user,
    initialData: { daysSinceLast: 0, streak: user?.currentStreak ?? -1 },
    queryFn: async () => {
      if (!user) return { daysSinceLast: 0, streak: -1 };
      const result = await fetchStreak(user);
      return result ?? { daysSinceLast: 0, streak: 0 };
    },
    queryKey: [...STREAK_QUERY_KEY, user],
    staleTime: Infinity,
  });
};

/** Provides imperative streak actions: optimistic increment and full recalculation. */
export const useStreakActions = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const setUser = useUserUpdate();

  const increment = useCallback(() => {
    queryClient.setQueryData<Streak>(STREAK_QUERY_KEY, (old) => ({
      daysSinceLast: 0,
      streak: (old?.streak ?? 0) + 1,
    }));
  }, [queryClient]);

  const refresh = useCallback(
    async (localEvents?: Events) => {
      if (!user) return;

      const result = localEvents
        ? calculateStreak(user, localEvents)
        : await fetchStreak(user);

      if (!result) return;

      queryClient.setQueryData<Streak>(STREAK_QUERY_KEY, {
        daysSinceLast: result.daysSinceLast,
        streak: result.streak,
      });

      try {
        const { isNewBest, today } = await persistStreak(user, result.streak);
        if (isNewBest) {
          setUser({
            ...user,
            bestStreak: result.streak,
            currentStreak: result.streak,
            streakUpdatedDate: today,
          });
        }
      } catch (error) {
        console.error('Failed to persist streak:', error);
      }
    },
    [user, setUser, queryClient],
  );

  return { increment, refresh };
};
