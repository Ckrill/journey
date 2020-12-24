import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Helpers
import { getFromLocalStorage } from '../helpers/localStorage';

// Components
import SectionContainer from '../components/Section/SectionContainer';
import Section from '../components/Section/Section';
import Heading from '../components/Heading/Heading';
// import EventList from '../components/EventList/EventList';
import Paragraph from '../components/Paragraph/Paragraph';

const Journey = () => {
  const [events, setEvents] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  const concatEvents = (workouts: [], tests: [], milestones: []) => {
    const events = workouts.concat(tests, milestones) || null;
    return events;
  };

  useEffect(() => {
    if (!firstRender) return;

    const tests = getFromLocalStorage('tests') || [];
    const workouts = getFromLocalStorage('workouts') || [];
    const milestones = getFromLocalStorage('milestones') || [];

    const events = concatEvents(workouts, tests, milestones);

    setEvents(events);

    setFirstRender(false);
  }, [firstRender]);

  return (
    <SectionContainer>
      <Section>
        <Heading>Your journey</Heading>
        {/* TODO: Placeholder: graph of tests. */}
        {/* TODO: Idea: button to toggle between tests andworkouts. */}
        {/* TODO: Idea: Summary of progress, latests test resuts, compared to first test */}

        {/* TODO: Add error boundary here instead of "tests &&" */}

        {/* {events.length > 0 && <EventList events={events} user={user} />} */}
        {events.length === 0 && (
          <Paragraph>
            You havent started your journey yet, head on over to{' '}
            <Link to={'/'}>Home</Link> to start the initial test.
          </Paragraph>
        )}

        {/* {exercises && <Calibration exercises={exercises} />} */}
      </Section>
    </SectionContainer>
  );
};

export default Journey;
