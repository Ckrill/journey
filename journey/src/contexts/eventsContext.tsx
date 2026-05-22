import { createContext, type ReactNode, use, useState } from 'react';

// Types
import type { Events } from '../types/types';

const EventsContext = createContext<Events>([]);
const EventsUpdateContext = createContext<(events: Events) => void>(() => null);

export const useEvents = () => use(EventsContext);
export const useEventsUpdate = () => use(EventsUpdateContext);

type Props = { children: ReactNode };

export const EventsProvider = ({ children }: Props) => {
  const [events, setEvents] = useState<Events | []>([]);

  return (
    <EventsContext value={events}>
      <EventsUpdateContext value={setEvents}>{children}</EventsUpdateContext>
    </EventsContext>
  );
};
