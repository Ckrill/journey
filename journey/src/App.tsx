import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import Journey from './screens/Journey';
import Event from './screens/Event';
import Settings from './screens/Settings';
import SignIn from './screens/SignIn';

// Helpers
import { primeEvents } from './helpers/dataHandler';
import { getFromLocalStorage } from './helpers/localStorage';
import { get, getItemsByType } from './helpers/requests';
import { calculateStreak } from './helpers/streak';

// Components
import Header from './components/Header/Header';

// Contexts
import { useUser, useUserUpdate } from './contexts/userContext';
import { useEventsUpdate } from './contexts/eventsContext';
import { useStreakUpdate } from './contexts/streakContext';

// styles
import './App.scss';

// Types
import { EventsContentful } from './types/contentfulTypes';
import { User, Events } from './types/types';

const getEvents = () => get(getItemsByType('workout'));

function App() {
  const location = useLocation();
  const user = useUser();
  const setUser = useUserUpdate();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) return;

    const user: User = getFromLocalStorage('user');

    setUser(user);

    getEvents().then((eventsContentful: EventsContentful) => {
      const events: Events = primeEvents(eventsContentful);
      setEvents(events);

      const streak = calculateStreak(user, events);
      setStreak(streak);
    });

    setFirstRender(false);
  }, [firstRender, setEvents, setStreak, setUser]);

  return (
    <>
      {user ? (
        <>
          <Header />

          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              <Route path="/journey" element={<Journey />} />

              <Route path="/" element={<Event />} />

              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </>
      ) : (
        <SignIn setUser={setUser} />
      )}
    </>
  );
}

export default App;
