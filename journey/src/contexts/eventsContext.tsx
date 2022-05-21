import { createContext, ReactNode, useContext, useState } from 'react';

// Types
import { Workouts } from '../types/types';

const EventsContext = createContext<Workouts>([]);
const EventsUpdateContext = createContext<(events: Workouts) => void>(
  () => null
);

export const useEvents = () => useContext(EventsContext);
export const useEventsUpdate = () => useContext(EventsUpdateContext);

type Props = { children: ReactNode };

export const EventsProvider = ({ children }: Props) => {
  const [events, setEvents] = useState<Workouts | []>([]);

  return (
    <EventsContext.Provider value={events}>
      <EventsUpdateContext.Provider value={setEvents}>
        {children}
      </EventsUpdateContext.Provider>
    </EventsContext.Provider>
  );
};
