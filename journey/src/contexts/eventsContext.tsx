import { createContext, type ReactNode, use, useState } from 'react';

// Helpers
import { calculateStreak } from '../helpers/streak';

// Contexts
import { useUser } from './userContext';

// Types
import type { Events } from '../types/types';

type Streak = { daysSinceLast: number; streak: number };

const EventsContext = createContext<Events>([]);
const EventsUpdateContext = createContext<(events: Events) => void>(() => null);
const StreakContext = createContext<Streak>({ daysSinceLast: 0, streak: -1 });

export const useEvents = () => use(EventsContext);
export const useEventsUpdate = () => use(EventsUpdateContext);
export const useStreak = () => use(StreakContext);

type Props = { children: ReactNode };

export const EventsProvider = ({ children }: Props) => {
  const user = useUser();
  const [events, setEvents] = useState<Events | []>([]);

  const streak = calculateStreak(user, events);

  return (
    <EventsContext value={events}>
      <EventsUpdateContext value={setEvents}>
        <StreakContext value={streak}>{children}</StreakContext>
      </EventsUpdateContext>
    </EventsContext>
  );
};
