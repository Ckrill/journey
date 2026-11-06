// Miscellaneous
import DayStatusGroup from '../../DayStrip/DayStatus/DayStatusGroup';
import DayStrip from '../../DayStrip/DayStrip';

// Types
import type { Habit, Weekday } from '../../../types/types';

// Styles
import styles from './HabitSummaryItem.module.scss';

interface Props {
  completed: number;
  completedDays: Weekday[];
  habit: Habit;
  met: boolean;
}

const HabitSummaryItem = ({ completed, completedDays, habit, met }: Props) => (
  <li>
    <DayStrip
      name={<span className={styles.name}>{habit.name}</span>}
      trailing={
        <span className={styles.result} data-met={met}>
          {completed} / {habit.weeklyTarget}
        </span>
      }
    >
      <DayStatusGroup completedDays={completedDays} name={habit.name} />
    </DayStrip>
  </li>
);

export default HabitSummaryItem;
