import clsx from 'clsx';

import { getTimeBars } from './helpers/timeBars';

import { useSettings } from '../../contexts/settingsContext';

import { useHabitsQuery } from '../../hooks/useHabitsQuery';

import BarDetail from './BarDetail';

import styles from './TimeProgress.module.scss';

const TimeProgress = () => {
  const settings = useSettings();
  const { data: habits } = useHabitsQuery();

  const bars = getTimeBars(habits, settings.birthYear);

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

          <div
            aria-label={`${bar.label} progress`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.round(bar.progress)}
            className={styles.track}
            role="progressbar"
          >
            <div
              className={styles.fill}
              style={{ '--progress': bar.progress } as React.CSSProperties}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TimeProgress;
