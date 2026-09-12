// External
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

// Utilities
import { formatWeekRange, weekNumber } from '../../helpers/week';

// Styles
import styles from './WeekSwitcher.module.scss';

type Props = {
  canGoNext: boolean;
  onCurrent: () => void;
  onNext: () => void;
  onPrev: () => void;
  weekStart: string;
};

const WeekSwitcher = ({
  canGoNext,
  onCurrent,
  onNext,
  onPrev,
  weekStart,
}: Props) => (
  <div className={styles.switcher}>
    <button
      aria-label="Previous week"
      className={styles.arrow}
      onClick={onPrev}
      type="button"
    >
      <BsChevronLeft />
    </button>

    <button className={styles.label} onClick={onCurrent} type="button">
      <span className={styles.date}>{formatWeekRange(weekStart)}</span>
      <span className={styles.week}>Week {weekNumber(weekStart)}</span>
    </button>

    <button
      aria-label="Next week"
      className={styles.arrow}
      disabled={!canGoNext}
      onClick={onNext}
      type="button"
    >
      <BsChevronRight />
    </button>
  </div>
);

export default WeekSwitcher;
