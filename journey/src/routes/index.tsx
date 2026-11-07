// External
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

// Utilities
import { calculateStreak } from '../helpers/streak';
import { getHeading } from '../helpers/synonyms';
import { currentWeekStart, weekDates } from '../helpers/week';

// Hooks
import { eventsQueryOptions, useEventsQuery } from '../hooks/useEventsQuery';
import { habitsQueryOptions, useHabitsQuery } from '../hooks/useHabitsQuery';

// Data
import feedbackHeading from '../data/synonyms/feedback-heading.json';

// Miscellaneous
import Button from '../components/Button/Button';
import Feedback from '../components/Feedback/Feedback';
import HabitFormModal from '../components/Habit/HabitModal/HabitFormModal';
import Heading from '../components/Heading/Heading';
import PageTransition from '../components/PageTransition/PageTransition';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import WeekPager from '../components/Week/WeekPager';

// Types
import type { Habit } from '../types/types';

const Habits = () => {
  const navigate = useNavigate();
  const { data: habits } = useHabitsQuery();
  const { data: events } = useEventsQuery();

  const [editing, setEditing] = useState<Habit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [celebrateStreak, setCelebrateStreak] = useState(0);
  const [celebrateHeading, setCelebrateHeading] = useState('');

  // Map each habit to the set of dates it was completed on.
  const datesByHabit = new Map<string, Set<string>>();
  for (const event of events) {
    let set = datesByHabit.get(event.habitId);
    if (!set) {
      set = new Set<string>();
      datesByHabit.set(event.habitId, set);
    }
    set.add(event.date);
  }

  // Fire the celebration when a habit newly meets its target this week.
  const prevMetRef = useRef<Map<string, boolean> | null>(null);

  useEffect(() => {
    const currentDates = weekDates(currentWeekStart());
    const met = new Map<string, boolean>();
    for (const habit of habits) {
      const count = events.filter(
        (event) =>
          event.habitId === habit.id && currentDates.includes(event.date),
      ).length;
      met.set(habit.id, count >= habit.weeklyTarget);
    }

    if (prevMetRef.current) {
      for (const habit of habits) {
        const was = prevMetRef.current.get(habit.id) ?? false;
        const now = met.get(habit.id) ?? false;
        if (!was && now) {
          const streak = calculateStreak(habit, events).current;
          setCelebrateStreak(streak);
          setCelebrateHeading(getHeading(feedbackHeading, streak));
          setShowFeedback(true);
          break;
        }
      }
    }
    prevMetRef.current = met;
  }, [habits, events]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (habit: Habit) => {
    setEditing(habit);
    setModalOpen(true);
  };

  const closeHabitForm = () => {
    setModalOpen(false);
  };

  return (
    <PageTransition>
      <SectionContainer>
        <Section>
          <Heading level={1}>Habits</Heading>
        </Section>

        <Section>
          <WeekPager
            datesByHabit={datesByHabit}
            events={events}
            habits={habits}
            openEdit={openEdit}
          />
        </Section>

        <Section>
          <Button onClick={openCreate} type="button">
            + Add habit
          </Button>

          <Button
            onClick={() => {
              void navigate({ to: '/retro' });
            }}
            priority="secondary"
            type="button"
          >
            Weekly retro
          </Button>
        </Section>
      </SectionContainer>

      <HabitFormModal
        habit={editing}
        onClose={closeHabitForm}
        open={modalOpen}
      />

      <Feedback
        heading={celebrateHeading}
        setShow={setShowFeedback}
        show={showFeedback}
        streak={celebrateStreak}
      />
    </PageTransition>
  );
};

interface WeekSearch {
  week?: string;
}

export const Route = createFileRoute('/')({
  component: Habits,
  validateSearch: (search: Record<string, unknown>): WeekSearch => ({
    week: typeof search.week === 'string' ? search.week : undefined,
  }),
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
    ]);
  },
});
