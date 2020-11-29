import React, { useEffect, useState } from 'react';
import * as contentful from 'contentful-management';

// Settings
import { settings } from '../settings/settings';

// Helpers
import { primeWorkouts } from '../helpers/dataHandler';
import { getFromLocalStorage } from '../helpers/localStorage';
import { get, getItemsByAttribute, getItemsByType } from '../helpers/requests';

// Components
// import Calibration from '../components/Calibration/Calibration';
// import Commitment from '../components/Commitment/Commitment';
import EventList from '../components/EventList/EventList';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import SignUp from '../components/SignUp/SignUp';

// Types
import { Event, Events, User, Workout, Workouts } from '../types/types';

const client = contentful.createClient({
  accessToken: process.env.REACT_APP_CONTENTFUL_USER || '',
});

const getContentfulUser = () =>
  get(getItemsByAttribute('user', 'fields.name', 'Chris'));
const getWorkouts = () => get(getItemsByType('workout'));

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | []>([]);
  console.log('workouts: ', workouts);
  const [events, setEvents] = useState<Events | []>([]);
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

    getContentfulUser().then((response) => {
      console.log(response);
    });

    getWorkouts().then((workoutsCrude) => {
      const workouts = primeWorkouts(workoutsCrude);
      const events = workouts.map((workout: Workout) => {
        const event: Event = { ...workout };
        event.type = 'workout';

        return event;
      });

      setWorkouts(workouts);
      setEvents(events);
    });

    // Create and publish item.
    // client
    //   .getSpace(settings.space)
    //   .then((space) => space.getEnvironment(settings.environment))
    //   .then((environment) =>
    //     environment.createEntry('user', {
    //       fields: {
    //         name: {
    //           'en-US': 'Test 4',
    //         },
    //         slug: {
    //           'en-US': 'test-4',
    //         },
    //       },
    //     })
    //   )
    //   .then((entry) => entry.publish())
    //   .then((entry) => console.log(entry))
    //   .catch(console.error);

    setFirstRender(false);
  }, [firstRender]);

  return (
    <SectionContainer>
      <Section>
        {/* <Paragraph>
          Good to see you{!user ? ', friend' : `, ${user!.name}`}
        </Paragraph> */}

        <Heading>The Crew</Heading>

        {/* User registration */}
        {!user && <SignUp handleUpdateUser={setUser} />}

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
