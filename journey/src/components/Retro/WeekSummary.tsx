// Types
import type { WeekSummary as WeekSummaryData } from '../../helpers/retro';

// Miscellaneous
import Paragraph from '../Paragraph/Paragraph';
import WeekSummaryItem from './WeekSummaryItem';

// Styles
import styles from './WeekSummary.module.scss';

interface Props {
  summary: WeekSummaryData;
}

const WeekSummary = ({ summary }: Props) => {
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
        {summary.habits.map(({ completed, days, habit, met }) => (
          <WeekSummaryItem
            completed={completed}
            days={days}
            habit={habit}
            key={habit.id}
            met={met}
          />
        ))}
      </ul>
    </div>
  );
};

export default WeekSummary;
