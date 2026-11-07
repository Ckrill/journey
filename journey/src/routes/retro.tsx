// External
import { createFileRoute } from '@tanstack/react-router';

// Utilities
import { summarizeWeek } from '../helpers/retro';
import { currentWeekStart, formatWeekRange, weekDates } from '../helpers/week';

// Hooks
import { eventsQueryOptions, useEventsQuery } from '../hooks/useEventsQuery';
import { habitsQueryOptions, useHabitsQuery } from '../hooks/useHabitsQuery';
import {
  reflectionQueryOptions,
  useReflectionQuery,
} from '../hooks/useReflectionQuery';

// Miscellaneous
import Divider from '../components/Divider/Divider';
import HabitSummary from '../components/Habit/HabitSummary/HabitSummary';
import Heading from '../components/Heading/Heading';
import PageTransition from '../components/PageTransition/PageTransition';
import Paragraph from '../components/Paragraph/Paragraph';
import ParagraphGroup from '../components/ParagraphGroup/ParagraphGroup';
import ReflectionForm from '../components/Reflection/ReflectionForm';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

const Retro = () => {
  const weekStart = currentWeekStart();

  const { data: habits } = useHabitsQuery();
  const { data: events } = useEventsQuery();
  const { data: reflection } = useReflectionQuery();

  const summary = summarizeWeek(habits, events, weekDates(weekStart));

  return (
    <PageTransition>
      <SectionContainer>
        <Section>
          <Heading level={1}>Retro</Heading>

          <Paragraph>{formatWeekRange(weekStart)}</Paragraph>

          <HabitSummary summary={summary} />
        </Section>

        <Section>
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <Heading>Reflect</Heading>

          <ParagraphGroup
            more={
              <>
                <Paragraph>
                  Changing habits is hard. Many have failed before you. But
                  every week is an opportunity to break old patterns and build
                  new ones.
                </Paragraph>

                <Paragraph>
                  Generally, consistency beats intensity. Focus on building
                  habits consistently rather than trying to do too much at once.
                  If you repeatedly miss your target, ask yourself whether your
                  goals are realistic and whether you need to adjust your
                  habits.
                </Paragraph>

                <Paragraph size="fine">
                  Your answers from last time are shown as hints and will be
                  overwritten when you save new ones.
                </Paragraph>
              </>
            }
          >
            <Paragraph>
              Do the retro at the end of each week. Remember that you do retro
              for you, and you alone. Be honest and avoid blame.
            </Paragraph>
          </ParagraphGroup>

          <ReflectionForm previous={reflection} />
        </Section>
      </SectionContainer>
    </PageTransition>
  );
};

export const Route = createFileRoute('/retro')({
  component: Retro,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query({
        ...habitsQueryOptions(context.userId),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...eventsQueryOptions(context.userId),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...reflectionQueryOptions(context.userId),
        staleTime: 'static',
      }),
    ]);
  },
  head: () => ({ meta: [{ title: 'Retro - Journey' }] }),
});
