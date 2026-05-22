import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
} from 'react';

import { calculateStreak } from '../helpers/streak';
import { fetchStreak } from '../helpers/streakFetch';
import { persistStreak } from '../helpers/streakPersist';
import { useUser, useUserUpdate } from '../contexts/userContext';

import type { Events } from '../types/types';

type Streak = { daysSinceLast: number; streak: number };

/** Encapsulates streak refresh logic: recalculates on stale cache and persists updates to Contentful. */
export const useStreakRefresh = (
  setStreak: Dispatch<SetStateAction<Streak>>,
) => {
  const user = useUser();
  const setUser = useUserUpdate();

  // Recalculate streak and persist to Contentful.
  // Pass localEvents after adding an event to avoid CDA propagation delay.
  const refresh = useCallback(
    async (localEvents?: Events) => {
      if (!user) return;

      const result = localEvents
        ? calculateStreak(user, localEvents)
        : await fetchStreak(user);

      if (!result) return;

      setStreak({ streak: result.streak, daysSinceLast: result.daysSinceLast });

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
    [user, setUser, setStreak],
  );

  // On load — fetch and recalculate if cached value is stale
  useEffect(() => {
    if (!user) return;

    const today = Temporal.Now.plainDateISO().toString();
    if (user.streakUpdatedDate === today && user.currentStreak != null) return;

    void fetchStreak(user).then((r) => {
      if (r) setStreak(r);
    });
  }, [user, setStreak]);

  return refresh;
};
