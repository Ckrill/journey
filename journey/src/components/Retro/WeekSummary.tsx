// Types
import type { WeekSummary as WeekSummaryData } from '../../helpers/retro';
// Utilities
import { WEEKDAY_LABELS } from '../../helpers/week';

// Miscellaneous
import Paragraph from '../Paragraph/Paragraph';

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
          <li className={styles.item} key={habit.id}>
            <div className={styles.header}>
              <span className={styles.name}>{habit.name}</span>
              <span className={styles.result} data-met={met}>
                {completed} / {habit.weeklyTarget}
              </span>
            </div>

            <ol aria-label={`${habit.name} days`} className={styles.days}>
              {days.map((done, index) => (
                <li
                  className={styles.day}
                  data-done={done}
                  key={WEEKDAY_LABELS[index]}
                >
                  <span aria-hidden>{WEEKDAY_LABELS[index][0]}</span>
                  <span className={styles.srOnly}>
                    {WEEKDAY_LABELS[index]}: {done ? 'done' : 'not done'}
                  </span>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeekSummary;
