// Utilities
import { countCompletedWeeks } from '../../../helpers/completedWeeks';

// Miscellaneous
import Paragraph from '../../Paragraph/Paragraph';
import HabitItem from './HabitItem';

// Types
import type { Events, Habit } from '../../../types/types';

// Styles
import styles from './HabitList.module.scss';

interface Props {
  dates: string[];
  datesByHabit: Map<string, Set<string>>;
  events: Events;
  habits: Habit[];
  openEdit: (habit: Habit) => void;
}

const HabitList = ({
  dates,
  datesByHabit,
  events,
  habits,
  openEdit,
}: Props) => {
  const completedWeeks = new Map<string, number>();
  for (const habit of habits) {
    completedWeeks.set(habit.id, countCompletedWeeks(habit, events));
  }

  if (habits.length === 0) {
    return (
      <div className={styles.habits}>
        <Paragraph>No habits yet. Add one to begin your journey.</Paragraph>
      </div>
    );
  }

  return (
    <ul className={styles.habits}>
      {habits.map((habit) => (
        <HabitItem
          completedDates={datesByHabit.get(habit.id) ?? new Set<string>()}
          completedWeeks={completedWeeks.get(habit.id) ?? 0}
          habit={habit}
          key={habit.id}
          onEdit={openEdit}
          weekDates={dates}
        />
      ))}
    </ul>
  );
};

export default HabitList;
