import { useEffect, useState } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'framer-motion';

// Settings
import { settings } from '../settings/settings';

// Screens
import SignIn from '../screens/SignIn';

// Helpers
import { primeEvents } from '../helpers/dataHandler';
import { getFromLocalStorage } from '../helpers/localStorage';
import { get, getItemsByType } from '../helpers/requests';
import { calculateStreak } from '../helpers/streak';

// Components
import Header from '../components/Header/Header';

// Contexts
import { useUser, useUserUpdate } from '../contexts/userContext';
import { useSettingsUpdate } from '../contexts/settingsContext';
import { useEvents, useEventsUpdate } from '../contexts/eventsContext';
import { useStreakUpdate } from '../contexts/streakContext';

// styles
import '../App.scss';

// Types
import type { EventsContentful } from '../types/contentfulTypes';
import type { User, Events, Settings as SettingsType } from '../types/types';

const getEvents = () => get(getItemsByType('workout', 0));
const getEvents2 = () => get(getItemsByType('workout', settings.limit));

const RootComponent = () => {
  const user = useUser();
  const setUser = useUserUpdate();
  const setSettings = useSettingsUpdate();
  const events = useEvents();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    // console.log(events);
  }, [events]);

  useEffect(() => {
    if (!firstRender) return;

    const user: User = getFromLocalStorage('user');
    setUser(user);

    const settings: SettingsType = getFromLocalStorage('settings');
    setSettings(settings || { sound: true, vibration: true });

    getEvents().then((eventsContentful: EventsContentful) => {
      getEvents2().then((eventsContentful2: EventsContentful) => {
        const allEvents = { ...eventsContentful };
        allEvents.items = allEvents.items.concat(eventsContentful2.items);

        const events: Events = primeEvents(allEvents);
        setEvents(events);

        const streak = calculateStreak(user, events);
        setStreak(streak);
      });
    });

    setFirstRender(false);
  }, [firstRender, setEvents, setSettings, setStreak, setUser]);

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
  component: RootComponent,
});
