// Utilities
import type { WeekSummaryData } from '../../../helpers/retro';
import { planSummary } from '../../../helpers/summaryAnimation';
import { formatWeekRange } from '../../../helpers/week';

// Miscellaneous
import Paragraph from '../../Paragraph/Paragraph';
import HabitSummaryItem from './HabitSummaryItem';
import SummaryScore from './SummaryScore';

// Styles
import styles from './HabitSummary.module.scss';

interface Props {
  summary: WeekSummaryData;
  weekStart: string;
}

const HabitSummary = ({ summary, weekStart }: Props) => {
  const total = summary.habits.length;

  if (total === 0) {
    return <Paragraph>No habits were being tracked this week.</Paragraph>;
  }

  const plan = planSummary(summary.metCount, total);

  return (
    <div className={styles.summary} style={plan.vars}>
      <div className={styles.headline}>
        <Paragraph>{formatWeekRange(weekStart)}</Paragraph>

        <SummaryScore metCount={summary.metCount} plan={plan} total={total} />

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
