// External
import clsx from 'clsx';

// Utilities
import { WEEKDAY_LABELS } from '../../helpers/week';

// Miscellaneous
import WeekDay from './WeekDay';

// Styles
import shared from '../Habit/DayStrip.module.scss';
import styles from './WeekDays.module.scss';

interface Props {
  /** Per weekday (Mon→Sun): whether the habit was done that day. */
  days: boolean[];
  name: string;
}

const WeekDays = ({ days, name }: Props) => (
  <ol aria-label={`${name} days`} className={clsx(shared.strip, styles.days)}>
    {days.map((done, index) => (
      <WeekDay
        done={done}
        key={WEEKDAY_LABELS[index]}
        label={WEEKDAY_LABELS[index]}
      />
    ))}
  </ol>
);

export default WeekDays;
