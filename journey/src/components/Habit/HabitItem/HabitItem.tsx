import clsx from 'clsx';
import { BsFire } from 'react-icons/bs';

import Days from './Days';

// Types
import type { Habit } from '../../../types/types';

// Styles
import styles from './HabitItem.module.scss';

interface Props {
  completedDates: Set<string>;
  currentStreak: number;
  habit: Habit;
  onEdit: (habit: Habit) => void;
  weekDates: string[];
}

const HabitItem = ({
  completedDates,
  currentStreak,
  habit,
  onEdit,
  weekDates,
}: Props) => {
  const completedCount = weekDates.filter((date) =>
    completedDates.has(date),
  ).length;
  const targetMet = completedCount >= habit.weeklyTarget;

  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <button
          className={styles.name}
          onClick={() => {
            onEdit(habit);
          }}
          type="button"
        >
          <span>
            <span>{habit.name}</span>
          </span>
        </button>

        <span
          aria-hidden={currentStreak === 0}
          aria-label={`${String(currentStreak)} week streak`}
          className={clsx(
            styles.streak,
            currentStreak === 0 && styles.empty,
            targetMet && styles.active,
          )}
          role="img"
        >
          <BsFire className={styles.flame} />
          {currentStreak}
        </span>
      </div>

      <Days
        completedDates={completedDates}
        habit={habit}
        weekDates={weekDates}
      />
    </div>
  );
};

export default HabitItem;
