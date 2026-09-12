// External
import { useMemo } from 'react';

// Utilities
import { calculateStreak } from '../../helpers/streak';

// Miscellaneous
import Paragraph from '../Paragraph/Paragraph';
import HabitItem from './HabitItem/HabitItem';

// Types
import type { Events, Habit } from '../../types/types';

// Styles
import styles from './HabitList.module.scss';

type Props = {
  dates: string[];
  datesByHabit: Map<string, Set<string>>;
  events: Events;
  habits: Habit[];
  openEdit: (habit: Habit) => void;
};

const HabitList = ({
  dates,
  datesByHabit,
  events,
  habits,
  openEdit,
}: Props) => {
  // Current streak per habit (always relative to the real current week).
  const streaks = useMemo(() => {
    const map = new Map<string, number>();
    for (const habit of habits) {
      map.set(habit.id, calculateStreak(habit, events).current);
    }
    return map;
  }, [habits, events]);

  const sortedHabits = useMemo(
    () => [...habits].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    [habits],
  );

  if (sortedHabits.length === 0) {
    return (
      <div className={styles.habits}>
        <Paragraph>No habits yet. Add one to begin your journey.</Paragraph>
      </div>
    );
  }

  return (
    <div className={styles.habits}>
      {sortedHabits.map((habit) => (
        <HabitItem
          completedDates={datesByHabit.get(habit.id) ?? new Set<string>()}
          currentStreak={streaks.get(habit.id) ?? 0}
          habit={habit}
          key={habit.id}
          onEdit={openEdit}
          weekDates={dates}
        />
      ))}
    </div>
  );
};

export default HabitList;
