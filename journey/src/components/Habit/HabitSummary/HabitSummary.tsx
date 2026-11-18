// Types
import type { WeekSummaryData } from '../../../helpers/retro';
import { formatWeekRange } from '../../../helpers/week';

// Miscellaneous
import Paragraph from '../../Paragraph/Paragraph';
import HabitSummaryItem from './HabitSummaryItem';

// Styles
import styles from './HabitSummary.module.scss';

interface Props {
  summary: WeekSummaryData;
  weekStart: string;
}

const HabitSummary = ({ summary, weekStart }: Props) => {
  if (summary.habits.length === 0) {
    return <Paragraph>No habits were being tracked this week.</Paragraph>;
  }

  return (
    <div className={styles.summary}>
      <div className={styles.headline}>
        <Paragraph>{formatWeekRange(weekStart)}</Paragraph>

        <span className={styles.count}>
          {summary.metCount}&thinsp;/&thinsp;{summary.habits.length}
        </span>

        <span className={styles.caption}>goals met</span>
      </div>

      <ul className={styles.list}>
        {summary.habits.map(({ completed, completedDays, habit, met }) => (
          <HabitSummaryItem
            completed={completed}
            completedDays={completedDays}
            habit={habit}
            key={habit.id}
            met={met}
          />
        ))}
      </ul>
    </div>
  );
};

export default HabitSummary;
