// Miscellaneous
import DayStatusStrip from '../../DayStrip/DayStatusStrip/DayStatusStrip';
import DayStripRow from '../../DayStrip/DayStripRow/DayStripRow';

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
    <DayStripRow
      name={<span className={styles.name}>{habit.name}</span>}
      trailing={
        <span className={styles.result} data-met={met}>
          {completed} / {habit.weeklyTarget}
        </span>
      }
    >
      <DayStatusStrip completedDays={completedDays} name={habit.name} />
    </DayStripRow>
  </li>
);

export default HabitSummaryItem;
