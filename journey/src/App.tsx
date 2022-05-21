import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Screens
import Home from './screens/Home';
import Workout from './screens/Workout';
import Settings from './screens/Settings';
import SignIn from './screens/SignIn';

// Helpers
import { primeWorkouts } from './helpers/dataHandler';
import { getFromLocalStorage } from './helpers/localStorage';
import { get, getItemsByType } from './helpers/requests';

// Components
import Header from './components/Header/Header';

import { useUser, useUserUpdate } from './contexts/userContext';
import { useEventsUpdate } from './contexts/eventsContext';

// styles
import './App.scss';

// Types
import { WorkoutsContentful } from './types/contentfulTypes';
import { User, Workouts } from './types/types';

const getWorkouts = () => get(getItemsByType('workout'));

function App() {
  const user = useUser();
  const setUser = useUserUpdate();
  const setEvents = useEventsUpdate();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) return;

    const user: User = getFromLocalStorage('user');

    setUser(user);

    getWorkouts().then((workoutsContentful: WorkoutsContentful) => {
      const events: Workouts = primeWorkouts(workoutsContentful);

      setEvents(events);
    });

    setFirstRender(false);
  }, [firstRender, setEvents, setUser]);

  return (
    <BrowserRouter>
      {user ? (
        <>
          <Header />

          <Routes>
            <Route path="/journey" element={<Home />} />

            <Route path="/" element={<Workout />} />

            <Route path="/settings" element={<Settings />} />
          </Routes>
        </>
      ) : (
        <SignIn setUser={setUser} />
      )}
    </BrowserRouter>
  );
}

export default App;
