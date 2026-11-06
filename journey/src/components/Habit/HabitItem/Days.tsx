// External
import clsx from 'clsx';

// Utilities
import { today, WEEKDAY_LABELS, WEEKDAYS } from '../../../helpers/week';

// Hooks
import { useToggleEvent } from '../../../hooks/useToggleEvent';

// Miscellaneous
import Day from './Day';

// Types
import type { Habit } from '../../../types/types';

// Styles
import shared from '../DayStrip.module.scss';
import styles from './Days.module.scss';

interface Props {
  completedDates: Set<string>;
  habit: Habit;
  weekDates: string[];
}

const Days = ({ completedDates, habit, weekDates }: Props) => {
  const { mutateAsync } = useToggleEvent();

  const targetMet =
    weekDates.filter((date) => completedDates.has(date)).length >=
    habit.weeklyTarget;

  return (
    <div className={clsx(shared.strip, styles.days)}>
      {weekDates.map((date, index) => {
        const done = completedDates.has(date);

        return (
          <Day
            date={date}
            done={done}
            isFuture={date > today()}
            isToday={date === today()}
            key={date}
            label={WEEKDAY_LABELS[index]}
            onToggle={(toggledDate) =>
              mutateAsync({ date: toggledDate, habitId: habit.id })
            }
            planned={
              !targetMet && !done && habit.plannedDays.includes(WEEKDAYS[index])
            }
          />
        );
      })}
    </div>
  );
};

export default Days;
