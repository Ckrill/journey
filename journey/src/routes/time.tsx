// External
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Miscellaneous
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import TimeProgress from '../components/TimeProgress/TimeProgress';

const Time = () => {
  return (
    <motion.div
      animate="animate"
      exit="exit"
      initial="initial"
      transition={pageTransition}
      variants={pageVariants}
    >
      <SectionContainer>
        <Section>
          <Heading>Time</Heading>

          <TimeProgress />
        </Section>
      </SectionContainer>
    </motion.div>
  );
};

export const Route = createFileRoute('/time')({
  component: Time,
});
