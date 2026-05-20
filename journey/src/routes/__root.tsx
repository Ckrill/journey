import { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'framer-motion';

// Screens
import SignIn from '../screens/SignIn';

// Helpers
import { primeEvents } from '../helpers/dataHandler';
import { getAll } from '../helpers/requests';
import { calculateStreak } from '../helpers/streak';

// Components
import Header from '../components/Header/Header';

// Contexts
import { useUser } from '../contexts/userContext';
import { useEventsUpdate } from '../contexts/eventsContext';
import { useStreakUpdate } from '../contexts/streakContext';

// styles
import '../App.scss';

// Types
import type { EventsContentful } from '../types/contentfulTypes';

const RootComponent = () => {
  const { events: loadedEvents } = Route.useLoaderData();

  const user = useUser();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();

  useEffect(() => {
    setEvents(loadedEvents);

    const streak = calculateStreak(user, loadedEvents);
    setStreak(streak);
  }, [user, loadedEvents, setEvents, setStreak]);

  return (
    <>
      {user ? (
        <>
          <Header />

          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </>
      ) : (
        <SignIn />
      )}

      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  loader: async () => {
    const allEvents = await getAll<EventsContentful>('workout');
    const events = primeEvents(allEvents);

    return { events };
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Failed to load events</div>,
  component: RootComponent,
});
