// External
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Utilities
import { calculateStreak } from '../helpers/streak';
import { currentWeekStart, weekDates } from '../helpers/week';

// Hooks
import { eventsQueryOptions, useEventsQuery } from '../hooks/useEventsQuery';
import { habitsQueryOptions, useHabitsQuery } from '../hooks/useHabitsQuery';

// Miscellaneous
import Button from '../components/Button/Button';
import Feedback from '../components/Feedback/Feedback';
import HabitFormModal from '../components/Habit/HabitModal/HabitFormModal';
import Heading from '../components/Heading/Heading';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import WeekPager from '../components/Week/WeekPager';

// Types
import type { Habit } from '../types/types';

const Journey = () => {
  const { data: habits } = useHabitsQuery();
  const { data: events } = useEventsQuery();

  const [editing, setEditing] = useState<Habit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [celebrateStreak, setCelebrateStreak] = useState(0);

  // Map each habit to the set of dates it was completed on.
  const datesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const event of events) {
      let set = map.get(event.habitId);
      if (!set) {
        set = new Set<string>();
        map.set(event.habitId, set);
      }
      set.add(event.date);
    }
    return map;
  }, [events]);

  // Fire the celebration when a habit newly meets its target this week.
  const prevMetRef = useRef<Map<string, boolean> | null>(null);

  useEffect(() => {
    const currentDates = weekDates(currentWeekStart());
    const met = new Map<string, boolean>();
    for (const habit of habits) {
      const set = datesByHabit.get(habit.id);
      const count = set
        ? currentDates.filter((date) => set.has(date)).length
        : 0;
      met.set(habit.id, count >= habit.weeklyTarget);
    }

    if (prevMetRef.current) {
      for (const habit of habits) {
        const was = prevMetRef.current.get(habit.id) ?? false;
        const now = met.get(habit.id) ?? false;
        if (!was && now) {
          setCelebrateStreak(calculateStreak(habit, events).current);
          setShowFeedback(true);
          break;
        }
      }
    }
    prevMetRef.current = met;
  }, [habits, events, datesByHabit]);

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
        </Section>
      </SectionContainer>

      <HabitFormModal
        habit={editing}
        onClose={closeHabitForm}
        open={modalOpen}
      />

      <Feedback
        setShow={setShowFeedback}
        show={showFeedback}
        streak={celebrateStreak}
      />
    </motion.div>
  );
};

interface WeekSearch {
  week?: string;
}

export const Route = createFileRoute('/')({
  component: Journey,
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
