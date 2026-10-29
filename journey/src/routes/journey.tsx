// External
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Hooks
import { habitsQueryOptions } from '../hooks/useHabitsQuery';

// Miscellaneous
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import TimeProgress from '../components/TimeProgress/TimeProgress';

const Journey = () => {
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
          <Heading>Journey</Heading>

          <TimeProgress />
        </Section>
      </SectionContainer>
    </motion.div>
  );
};

export const Route = createFileRoute('/journey')({
  component: Journey,
  loader: async ({ context }) => {
    await context.queryClient.query({
      ...habitsQueryOptions(context.userId),
      staleTime: 'static',
    });
  },
});
