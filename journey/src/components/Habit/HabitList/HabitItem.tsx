// External
import clsx from 'clsx';
import { BsFire } from 'react-icons/bs';

// Hooks
import { useToggleEvent } from '../../../hooks/useToggleEvent';

// Miscellaneous
import DayStrip from '../../DayStrip/DayStrip';
import DayToggleGroup from '../../DayStrip/DayToggle/DayToggleGroup';

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
  const { mutateAsync } = useToggleEvent();
  const completedCount = weekDates.filter((date) =>
    completedDates.has(date),
  ).length;
  const targetMet = completedCount >= habit.weeklyTarget;

  return (
    <DayStrip
      className={styles.row}
      name={
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
      }
      trailing={
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
      }
    >
      <DayToggleGroup
        completedDates={completedDates}
        markedDays={targetMet ? [] : habit.plannedDays}
        onToggle={(date) => mutateAsync({ date, habitId: habit.id })}
        weekDates={weekDates}
      />
    </DayStrip>
  );
};

export default HabitItem;
