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

// styles
import './App.scss';
import { useEffect, useState } from 'react';

// Types
import { WorkoutsContentful } from './types/contentfulTypes';
import { User, Workout as WorkoutType, Workouts } from './types/types';

const getWorkouts = () => get(getItemsByType('workout'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Workouts | []>([]);
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
  }, [firstRender]);

  const addEvent = (event: WorkoutType) => {
    const result = [...events];

    result.unshift(event);

    setEvents(result);
  };

  const deleteEvent = (id: string) => {
    const result = [...events];
    const index = events.findIndex((event) => id === event.id);

    if (index === -1) return;

    result.splice(index, 1);

    setEvents(result);
  };

  return (
    <BrowserRouter>
      {user ? (
        <>
          <Header />

          <Routes>
            <Route
              path="/journey"
              element={
                <Home events={events} deleteEvent={deleteEvent} user={user} />
              }
            />

            <Route
              path="/"
              element={
                <Workout addEvent={addEvent} events={events} user={user} />
              }
            />

            <Route
              path="/settings"
              element={<Settings setUser={setUser} user={user} />}
            />
          </Routes>
        </>
      ) : (
        <SignIn setUser={setUser} />
      )}
    </BrowserRouter>
  );
}

export default App;
