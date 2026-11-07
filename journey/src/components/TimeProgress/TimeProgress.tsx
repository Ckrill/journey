// External
import clsx from 'clsx';

// Utilities
import { getLifeExpectancyYears } from '../../helpers/lifeExpectancy';
import { getTimeBars } from './helpers/timeBars';

// Contexts
import { useSettings } from '../../contexts/settingsContext';

// Hooks
import { useHabitsQuery } from '../../hooks/useHabitsQuery';

// Miscellaneous
import BarDetail from './BarDetail';

// Styles
import styles from './TimeProgress.module.scss';

const TimeProgress = () => {
  const settings = useSettings();
  const { data: habits } = useHabitsQuery();

  const bars = getTimeBars(
    habits,
    getLifeExpectancyYears(settings.region, settings.sex),
    settings.birthYear,
  );

  return (
    <ul className={styles.list}>
      {bars.map((bar) => (
        <li className={clsx(styles.item, styles[bar.kind])} key={bar.id}>
          <div className={styles.header}>
            <span className={styles.name}>{bar.label}</span>

            <BarDetail
              elapsed={bar.detail.elapsed}
              kind={bar.kind}
              total={bar.detail.total}
            />
          </div>

          <progress
            aria-label={`${bar.label} progress`}
            className={styles.track}
            max={100}
            style={{ '--progress': bar.progress } as React.CSSProperties}
            value={bar.progress}
          />
        </li>
      ))}
    </ul>
  );
};

export default TimeProgress;
