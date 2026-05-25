// External
import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useMemo,
  useState,
} from 'react';

// Contexts
import { useUser } from './userContext';

// Hooks
import { useStreakRefresh } from '../hooks/useStreakRefresh';

// Types
import type { Events } from '../types/types';

type Streak = { daysSinceLast: number; streak: number };

type StreakActions = {
  increment: () => void;
  refresh: (localEvents?: Events) => Promise<void>;
};

const StreakContext = createContext<Streak>({ daysSinceLast: 0, streak: -1 });
const StreakActionsContext = createContext<StreakActions>({
  increment: () => undefined,
  refresh: () => Promise.resolve(),
});

export const useStreak = () => use(StreakContext);
export const useStreakActions = () => use(StreakActionsContext);

type Props = { children: ReactNode };

/** Provides streak data and actions (refresh, increment) to the component tree. */
export const StreakProvider = ({ children }: Props) => {
  const user = useUser();

  // Initialize from cache if available
  const [streak, setStreak] = useState<Streak>(() => {
    if (!user) return { daysSinceLast: 0, streak: -1 };
    const today = Temporal.Now.plainDateISO().toString();
    if (user.streakUpdatedDate === today && user.currentStreak != null) {
      return { daysSinceLast: 0, streak: user.currentStreak };
    }
    return { daysSinceLast: 0, streak: -1 };
  });

  const refresh = useStreakRefresh(setStreak);

  // Optimistic UI update — immediately reflects the new streak before persist completes
  const increment = useCallback(() => {
    setStreak((prev) => ({ daysSinceLast: 0, streak: prev.streak + 1 }));
  }, []);

  const actions = useMemo(() => ({ increment, refresh }), [refresh, increment]);

  return (
    <StreakContext value={streak}>
      <StreakActionsContext value={actions}>{children}</StreakActionsContext>
    </StreakContext>
  );
};
