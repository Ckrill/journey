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

  const showTarget = !targetMet;
  const showStreak = targetMet && currentStreak > 0;

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

        {showTarget && (
          <span className={styles.target}>
            {completedCount} / {habit.weeklyTarget}
          </span>
        )}

        {showStreak && (
          <span className={styles.streak}>
            {currentStreak} <BsFire />
          </span>
        )}
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
