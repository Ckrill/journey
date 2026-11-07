// External
import { createFileRoute } from '@tanstack/react-router';

// Hooks
import { habitsQueryOptions } from '../hooks/useHabitsQuery';

// Miscellaneous
import Heading from '../components/Heading/Heading';
import PageTransition from '../components/PageTransition/PageTransition';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import TimeProgress from '../components/TimeProgress/TimeProgress';

const Journey = () => {
  return (
    <PageTransition>
      <SectionContainer>
        <Section>
          <Heading level={1}>Journey</Heading>

          <TimeProgress />
        </Section>
      </SectionContainer>
    </PageTransition>
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
