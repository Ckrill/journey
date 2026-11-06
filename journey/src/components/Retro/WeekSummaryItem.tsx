// Miscellaneous
import HabitRow from '../Habit/HabitRow/HabitRow';
import WeekDays from './WeekDays';

// Types
import type { Habit } from '../../types/types';

// Styles
import styles from './WeekSummaryItem.module.scss';

interface Props {
  completed: number;
  /** Per weekday (Mon→Sun): whether the habit was done that day. */
  days: boolean[];
  habit: Habit;
  met: boolean;
}

const WeekSummaryItem = ({ completed, days, habit, met }: Props) => (
  <li>
    <HabitRow
      name={<span className={styles.name}>{habit.name}</span>}
      trailing={
        <span className={styles.result} data-met={met}>
          {completed} / {habit.weeklyTarget}
        </span>
      }
    >
      <WeekDays days={days} name={habit.name} />
    </HabitRow>
  </li>
);

export default WeekSummaryItem;
