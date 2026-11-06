// Types
import type { WeekSummaryData } from '../../../helpers/retro';

// Miscellaneous
import Paragraph from '../../Paragraph/Paragraph';
import HabitSummaryItem from './HabitSummaryItem';

// Styles
import styles from './HabitSummary.module.scss';

interface Props {
  summary: WeekSummaryData;
}

const HabitSummary = ({ summary }: Props) => {
  if (summary.habits.length === 0) {
    return <Paragraph>No habits were being tracked this week.</Paragraph>;
  }

  return (
    <div className={styles.summary}>
      <p className={styles.headline}>
        <span className={styles.count}>
          {summary.metCount} / {summary.habits.length}
        </span>

        <span className={styles.caption}>goals met</span>
      </p>

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
