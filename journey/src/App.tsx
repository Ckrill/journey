import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import Home from './screens/Home';
import Workout from './screens/Workout';
import Settings from './screens/Settings';
import SignIn from './screens/SignIn';

// Helpers
import { primeWorkouts } from './helpers/dataHandler';
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
import { WorkoutsContentful } from './types/contentfulTypes';
import { User, Workouts } from './types/types';

const getWorkouts = () => get(getItemsByType('workout'));

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

    getWorkouts().then((workoutsContentful: WorkoutsContentful) => {
      const events: Workouts = primeWorkouts(workoutsContentful);
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
              <Route path="/journey" element={<Home />} />

              <Route path="/" element={<Workout />} />

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
