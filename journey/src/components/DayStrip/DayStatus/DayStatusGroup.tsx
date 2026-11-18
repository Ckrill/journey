// Utilities
import { WEEKDAY_LABELS, WEEKDAYS } from '../../../helpers/week';

// Miscellaneous
import DayStatus from './DayStatus';

// Types
import type { Weekday } from '../../../types/types';

// Styles
import shared from '../DayStrip.module.scss';

interface Props {
  completedDays: Weekday[];
  name: string;
}

const DayStatusGroup = ({ completedDays, name }: Props) => (
  <ol aria-label={`${name} days`} className={shared.strip}>
    {WEEKDAYS.map((day, index) => (
      <DayStatus
        done={completedDays.includes(day)}
        key={day}
        label={WEEKDAY_LABELS[index]}
      />
    ))}
  </ol>
);

export default DayStatusGroup;
