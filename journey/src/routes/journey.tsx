import { useState } from 'react';
import {
  BsFillPersonFill as Person,
  BsFillPeopleFill as People,
} from 'react-icons/bs';
import { motion } from 'framer-motion';
import { createFileRoute } from '@tanstack/react-router';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Components
import EventList from '../components/EventList/EventList';
import MockEventList from '../components/EventList/MockEventList';
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import Streak from '../components/Streak/Streak';

// Hooks
import { useEventsQuery } from '../hooks/useEventsQuery';

// Contexts
import { useUser } from '../contexts/userContext';

// Components
import ShowMore from '../components/ShowMore/ShowMore';

const Journey = () => {
  const user = useUser();
  const { data: events = [] } = useEventsQuery();
  const pageSize = 10;

  const [soloMode, setSoloMode] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(pageSize);

  const eventsFiltered = soloMode
    ? events.filter((item) => item.user.id === user?.id)
    : events;

  const showMoreItems = () => {
    setItemsToShow(itemsToShow + pageSize);
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
              <Person onClick={() => { setSoloMode((prevState) => !prevState); }} />
            ) : (
              <People onClick={() => { setSoloMode((prevState) => !prevState); }} />
            )}
            <span>
              {soloMode ? `My ` : `Our `}
              journey
            </span>
          </Heading>

          {events.length > 0 ? (
            <EventList eventsToShow={eventsFiltered.slice(0, itemsToShow)} />
          ) : (
            <MockEventList />
          )}
        </Section>
      </SectionContainer>

      {eventsFiltered.length > itemsToShow && (
        <ShowMore callback={showMoreItems} />
      )}
    </motion.div>
  );
};

export const Route = createFileRoute('/journey')({
  component: Journey,
});
