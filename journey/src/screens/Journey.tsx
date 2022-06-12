import { useEffect, useState } from 'react';
import {
  BsFillPersonFill as Person,
  BsFillPeopleFill as People,
} from 'react-icons/bs';
import { motion } from 'framer-motion';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

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
import { Events } from '../types/types';
import Button from '../components/Button/Button';

const Journey = () => {
  const user = useUser();
  const events = useEvents();
  const [evemtsFiltered, setEventsFiltered] = useState<Events | []>([]);
  const [soloMode, setSoloMode] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    if (!user) return;

    if (soloMode) {
      const evemtsFiltered = events.filter((item) => {
        if (item.user.id === user.id) return item;
        return null;
      });
      setEventsFiltered(evemtsFiltered);
    } else {
      setEventsFiltered(events);
    }
  }, [user, soloMode, events]);

  const showMoreItems = () => {
    setItemsToShow(itemsToShow + 25);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
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
            <span>
              {soloMode ? `My ` : `Our `}
              journey
            </span>
          </Heading>

          {events.length > 0 ? (
            <EventList events={evemtsFiltered.slice(0, itemsToShow)} />
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
    </motion.div>
  );
};

export default Journey;
