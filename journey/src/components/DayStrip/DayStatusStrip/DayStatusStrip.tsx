// External
import clsx from 'clsx';

// Utilities
import { WEEKDAY_LABELS, WEEKDAYS } from '../../../helpers/week';

// Miscellaneous
import DayStatus from './DayStatus';

// Types
import type { Weekday } from '../../../types/types';

import shared from '../DayStrip.module.scss';
// Styles
import styles from './DayStatusStrip.module.scss';

interface Props {
  completedDays: Weekday[];
  name: string;
}

const DayStatusStrip = ({ completedDays, name }: Props) => (
  <ol aria-label={`${name} days`} className={clsx(shared.strip, styles.days)}>
    {WEEKDAYS.map((day, index) => (
      <DayStatus
        done={completedDays.includes(day)}
        key={day}
        label={WEEKDAY_LABELS[index]}
      />
    ))}
  </ol>
);

export default DayStatusStrip;
