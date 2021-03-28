import React, { useEffect, useState } from 'react';
import {
  BsFillPersonFill as Person,
  BsFillPeopleFill as People,
} from 'react-icons/bs';

// Helpers
import { primeWorkouts } from '../helpers/dataHandler';
import { getFromLocalStorage } from '../helpers/localStorage';
import { get, getItemsByType } from '../helpers/requests';

// Components
// import Calibration from '../components/Calibration/Calibration';
// import Commitment from '../components/Commitment/Commitment';
import EventList from '../components/EventList/EventList';
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import Streak from '../components/Streak/Streak';

// Types
import { WorkoutsContentful } from '../types/contentfulTypes';
import { User, Workouts } from '../types/types';

const getWorkouts = () => get(getItemsByType('workout'));

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | []>([]);
  const [workoutsFiltered, setWorkoutsFiltered] = useState<Workouts | []>([]);
  // const [events, setEvents] = useState<Events | []>([]);
  // const [exercises, setExercises] = useState<Exercises | null>(null);
  // const [tests, setTests] = useState<Tests | null>(null);
  const [firstRender, setFirstRender] = useState(true);
  const [soloMode, setSoloMode] = useState(false);

  useEffect(() => {
    if (!firstRender) return;

    const user: User = getFromLocalStorage('user');
    // const exercises = getFromLocalStorage('exercises');
    // const tests = getFromLocalStorage('tests');

    setUser(user);
    // setExercises(exercises);
    // setTests(tests);

    getWorkouts().then((workoutsContentful: WorkoutsContentful) => {
      const workouts: Workouts = primeWorkouts(workoutsContentful);
      // const events = workouts.map((workout: Workout) => {
      //   const event: Event = { ...workout };
      //   event.type = 'workout';

      //   return event;
      // });

      setWorkouts(workouts);
      // setEvents(events);
    });

    setFirstRender(false);
  }, [firstRender]);

  useEffect(() => {
    if (!user) return;

    if (soloMode) {
      const workoutsFiltered = workouts.filter((item) => {
        if (item.user.id === user.id) return item;
        return null;
      });
      setWorkoutsFiltered(workoutsFiltered);
    } else {
      setWorkoutsFiltered(workouts);
    }
  }, [user, soloMode, workouts]);

  return (
    <SectionContainer>
      <Section>
        <Streak user={user} workouts={workouts} />
      </Section>
      <Section>
        {/* <Paragraph>
          Good to see you{!user ? ', friend' : `, ${user!.name}`}
        </Paragraph> */}

        <Heading>
          {soloMode ? (
            <Person onClick={() => setSoloMode((prevState) => !prevState)} />
          ) : (
            <People onClick={() => setSoloMode((prevState) => !prevState)} />
          )}
          {soloMode ? ` My ` : ` Our `}
          journey
        </Heading>

        {workouts.length > 0 && (
          <EventList events={workoutsFiltered} user={user} />
        )}

        {/* {user && (
        <>
          {!exercises && <Commitment handleUpdateExercises={setExercises} />}

          {exercises && !tests && <Calibration exercises={exercises} />}
        </>
      )} */}
      </Section>
    </SectionContainer>
  );
};

export default Home;
