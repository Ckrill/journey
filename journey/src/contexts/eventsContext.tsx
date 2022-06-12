import { createContext, ReactNode, useContext, useState } from 'react';

// Types
import { Events } from '../types/types';

const EventsContext = createContext<Events>([]);
const EventsUpdateContext = createContext<(events: Events) => void>(() => null);

export const useEvents = () => useContext(EventsContext);
export const useEventsUpdate = () => useContext(EventsUpdateContext);

type Props = { children: ReactNode };

export const EventsProvider = ({ children }: Props) => {
  const [events, setEvents] = useState<Events | []>([]);

  return (
    <EventsContext.Provider value={events}>
      <EventsUpdateContext.Provider value={setEvents}>
        {children}
      </EventsUpdateContext.Provider>
    </EventsContext.Provider>
  );
};
