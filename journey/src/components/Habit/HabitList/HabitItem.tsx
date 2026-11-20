// External
import clsx from 'clsx';
import { BsFire, BsThreeDotsVertical } from 'react-icons/bs';

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
    <li>
      <DayStrip
        className={styles.row}
        name={<span className={styles.name}>{habit.name}</span>}
        trailing={
          <span className={styles.trailing}>
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

            <button
              aria-label={`Edit ${habit.name}`}
              className={styles.edit}
              onClick={() => {
                onEdit(habit);
              }}
              type="button"
            >
              <BsThreeDotsVertical aria-hidden="true" />
            </button>
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
    </li>
  );
};

export default HabitItem;
