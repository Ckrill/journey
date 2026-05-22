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
  refresh: (localEvents?: Events) => Promise<void>;
  increment: () => void;
};

const StreakContext = createContext<Streak>({ daysSinceLast: 0, streak: -1 });
const StreakActionsContext = createContext<StreakActions>({
  refresh: () => Promise.resolve(),
  increment: () => undefined,
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
      return { streak: user.currentStreak, daysSinceLast: 0 };
    }
    return { daysSinceLast: 0, streak: -1 };
  });

  const refresh = useStreakRefresh(setStreak);

  // Optimistic UI update — immediately reflects the new streak before persist completes
  const increment = useCallback(() => {
    setStreak((prev) => ({ streak: prev.streak + 1, daysSinceLast: 0 }));
  }, []);

  const actions = useMemo(() => ({ refresh, increment }), [refresh, increment]);

  return (
    <StreakContext value={streak}>
      <StreakActionsContext value={actions}>{children}</StreakActionsContext>
    </StreakContext>
  );
};
