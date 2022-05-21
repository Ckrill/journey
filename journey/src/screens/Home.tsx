import { useEffect, useState } from 'react';
import {
  BsFillPersonFill as Person,
  BsFillPeopleFill as People,
} from 'react-icons/bs';

// Components
import EventList from '../components/EventList/EventList';
import MockEventList from '../components/EventList/MockEventList';
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import Streak from '../components/Streak/Streak';

// Contexts
import { useUser } from '../contexts/userContext';
import { useEvents } from '../contexts/eventsContext';

// Types
import { Workouts } from '../types/types';
import Button from '../components/Button/Button';

const Home = () => {
  const user = useUser();
  const events = useEvents();
  const [workoutsFiltered, setWorkoutsFiltered] = useState<Workouts | []>([]);
  const [soloMode, setSoloMode] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(25);

  useEffect(() => {
    if (!user) return;

    if (soloMode) {
      const workoutsFiltered = events.filter((item) => {
        if (item.user.id === user.id) return item;
        return null;
      });
      setWorkoutsFiltered(workoutsFiltered);
    } else {
      setWorkoutsFiltered(events);
    }
  }, [user, soloMode, events]);

  const showMoreItems = () => {
    setItemsToShow(itemsToShow + 25);
  };

  return (
    <>
      <SectionContainer>
        <Section>
          <Streak />
        </Section>

        <Section>
          <Heading>
            {soloMode ? (
              <Person onClick={() => setSoloMode((prevState) => !prevState)} />
            ) : (
              <People onClick={() => setSoloMode((prevState) => !prevState)} />
            )}
            {soloMode ? ` My ` : ` Our `}
            journey
          </Heading>

          {events.length > 0 ? (
            <EventList events={workoutsFiltered.slice(0, itemsToShow)} />
          ) : (
            <MockEventList />
          )}
        </Section>
      </SectionContainer>

      {events.length > 0 && (
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
