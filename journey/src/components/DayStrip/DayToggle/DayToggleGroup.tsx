// External
import clsx from 'clsx';

// Utilities
import { today, WEEKDAY_LABELS, WEEKDAYS } from '../../../helpers/week';

// Miscellaneous
import DayToggle from './DayToggle';

// Types
import type { Weekday } from '../../../types/types';

import shared from '../DayStrip.module.scss';
// Styles
import styles from './DayToggleGroup.module.scss';

interface Props {
  completedDates: Set<string>;
  /** Weekdays to mark on days that are not done. */
  markedDays: Weekday[];
  onToggle: (date: string) => Promise<unknown>;
  weekDates: string[];
}

const DayToggleGroup = ({
  completedDates,
  markedDays,
  onToggle,
  weekDates,
}: Props) => (
  <div className={clsx(shared.strip, styles.days)}>
    {weekDates.map((date, index) => {
      const done = completedDates.has(date);

      return (
        <DayToggle
          date={date}
          done={done}
          isFuture={date > today()}
          isToday={date === today()}
          key={date}
          label={WEEKDAY_LABELS[index]}
          onToggle={onToggle}
          planned={!done && markedDays.includes(WEEKDAYS[index])}
        />
      );
    })}
  </div>
);

export default DayToggleGroup;
