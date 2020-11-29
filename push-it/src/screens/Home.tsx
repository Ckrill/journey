import React, { useEffect, useState } from 'react';

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

// Types
import { User, Workouts } from '../types/types';

const getWorkouts = () => get(getItemsByType('workout'));

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  console.log('user: ', user);
  const [workouts, setWorkouts] = useState<Workouts | []>([]);
  // const [events, setEvents] = useState<Events | []>([]);
  // const [exercises, setExercises] = useState<Exercises | null>(null);
  // const [tests, setTests] = useState<Tests | null>(null);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) return;

    const user = getFromLocalStorage('user');
    // const exercises = getFromLocalStorage('exercises');
    // const tests = getFromLocalStorage('tests');

    setUser(user);
    // setExercises(exercises);
    // setTests(tests);

    getWorkouts().then((workoutsCrude) => {
      const workouts = primeWorkouts(workoutsCrude);
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

  return (
    <SectionContainer>
      <Section>
        {/* <Paragraph>
          Good to see you{!user ? ', friend' : `, ${user!.name}`}
        </Paragraph> */}

        <Heading>Our journey</Heading>

        {workouts.length > 0 && <EventList events={workouts} />}

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
