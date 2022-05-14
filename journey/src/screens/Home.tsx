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
import EventList from '../components/EventList/EventList';
import MockEventList from '../components/EventList/MockEventList';
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import Streak from '../components/Streak/Streak';

// Types
import { WorkoutsContentful } from '../types/contentfulTypes';
import { User, Workouts } from '../types/types';
import Button from '../components/Button/Button';

const getWorkouts = () => get(getItemsByType('workout'));

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | []>([]);
  const [workoutsFiltered, setWorkoutsFiltered] = useState<Workouts | []>([]);
  const [firstRender, setFirstRender] = useState(true);
  const [soloMode, setSoloMode] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(25);

  useEffect(() => {
    if (!firstRender) return;

    const user: User = getFromLocalStorage('user');

    setUser(user);

    getWorkouts().then((workoutsContentful: WorkoutsContentful) => {
      const workouts: Workouts = primeWorkouts(workoutsContentful);

      setWorkouts(workouts);
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

  const showMoreItems = () => {
    setItemsToShow(itemsToShow + 25);
  };

  return (
    <>
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

          {workouts.length > 0 ? (
            <EventList
              events={workoutsFiltered.slice(0, itemsToShow)}
              user={user}
            />
          ) : (
            <MockEventList />
          )}
        </Section>
      </SectionContainer>

      {workouts.length > 0 && (
        <SectionContainer>
          <Section>
            <Button onClick={showMoreItems}>More...</Button>
          </Section>
        </SectionContainer>
      )}
    </>
  );
};

export default Home;
