// External
import { useState } from 'react';
import { BsCheck } from 'react-icons/bs';

// Utilities
import { today, WEEKDAY_LABELS } from '../../../helpers/week';

// Hooks
import { useToggleEvent } from '../../../hooks/useToggleEvent';

// Types
import type { Habit } from '../../../types/types';

// Styles
import styles from './Days.module.scss';

interface Props {
  completedDates: Set<string>;
  habit: Habit;
  weekDates: string[];
}

const Days = ({ completedDates, habit, weekDates }: Props) => {
  const toggle = useToggleEvent();

  const [pendingDate, setPendingDate] = useState<null | string>(null);

  const handleToggle = (date: string) => {
    setPendingDate(date);
    toggle.mutate(
      { date, habitId: habit.id, habitName: habit.name },
      {
        onSettled: () => {
          setPendingDate(null);
        },
      },
    );
  };

  return (
    <div className={styles.days}>
      {weekDates.map((date, index) => {
        const done = completedDates.has(date);
        const isFuture = date > today();
        const isPending = pendingDate === date;

        return (
          <button
            aria-label={`${WEEKDAY_LABELS[index]} ${date}`}
            aria-pressed={done}
            className={`${styles.day} ${done ? styles.done : ''}`}
            disabled={isFuture || isPending}
            key={date}
            onClick={() => {
              handleToggle(date);
            }}
            type="button"
          >
            {!done ? (
              WEEKDAY_LABELS[index][0]
            ) : (
              <BsCheck className={styles.check} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Days;
