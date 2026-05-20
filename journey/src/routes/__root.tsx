import { useEffect, useState } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'framer-motion';

// Screens
import SignIn from '../screens/SignIn';

// Helpers
import { primeEvents } from '../helpers/dataHandler';
import { getFromLocalStorage } from '../helpers/localStorage';
import { getAll } from '../helpers/requests';
import { calculateStreak } from '../helpers/streak';

// Components
import Header from '../components/Header/Header';

// Contexts
import { useUser, useUserUpdate } from '../contexts/userContext';
import { useSettingsUpdate } from '../contexts/settingsContext';
import { useEventsUpdate } from '../contexts/eventsContext';
import { useStreakUpdate } from '../contexts/streakContext';

// styles
import '../App.scss';

// Types
import type { EventsContentful } from '../types/contentfulTypes';
import type { User, Events, Settings as SettingsType } from '../types/types';

const RootComponent = () => {
  const { events: loadedEvents } = Route.useLoaderData();

  const user = useUser();
  const setUser = useUserUpdate();
  const setSettings = useSettingsUpdate();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const user: User = getFromLocalStorage('user');
    setUser(user);

    const settings: SettingsType = getFromLocalStorage('settings');
    setSettings(settings || { sound: true, vibration: true });

    setEvents(loadedEvents);

    const streak = calculateStreak(user, loadedEvents);
    setStreak(streak);

    setInitialized(true);
  }, [initialized, loadedEvents, setEvents, setSettings, setStreak, setUser]);

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
