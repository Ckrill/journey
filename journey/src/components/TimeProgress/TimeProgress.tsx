import { useSettings } from '../../contexts/settingsContext';

import styles from './TimeProgress.module.scss';

const getProgess = (ticks: number, elapsed: number) => {
  const progress = (elapsed / ticks) * 100;
  return progress;
};

const getLifeProgress = (birthYear: number) => {
  const today = Temporal.Now.plainDateISO();
  const birth = Temporal.PlainDate.from({ day: 1, month: 1, year: birthYear });
  const end = Temporal.PlainDate.from({
    day: 1,
    month: 1,
    year: birthYear + 80,
  });
  const ticks = birth.until(end, { largestUnit: 'days' }).days;
  const elapsed = birth.until(today, { largestUnit: 'days' }).days;

  return getProgess(ticks, elapsed);
};

const getYearProgress = () => {
  const today = Temporal.Now.plainDateISO();
  const ticks = today.daysInYear;
  const elapsed = today.dayOfYear;

  return getProgess(ticks, elapsed);
};

const getMonthProgress = () => {
  const today = Temporal.Now.plainDateISO();
  const ticks = today.daysInMonth;
  const elapsed = today.day;

  return getProgess(ticks, elapsed);
};

const getWeekProgress = () => {
  const elapsed = Temporal.Now.plainDateISO().dayOfWeek;

  return getProgess(7, elapsed);
};

const getDayProgress = () => {
  const elapsed = Temporal.Now.plainTimeISO().hour;

  return getProgess(24, elapsed);
};

type Ring = {
  className: string;
  label: string;
  progress: number;
};

const TimeProgress = () => {
  const settings = useSettings();

  const rings: Ring[] = [
    ...(settings.birthYear
      ? [
          {
            className: styles.life,
            label: 'Life',
            progress: getLifeProgress(settings.birthYear),
          },
        ]
      : []),
    {
      className: styles.year,
      label: 'Year',
      progress: getYearProgress(),
    },
    {
      className: styles.month,
      label: 'Month',
      progress: getMonthProgress(),
    },
    {
      className: styles.week,
      label: 'Week',
      progress: getWeekProgress(),
    },
    {
      className: styles.day,
      label: 'Day',
      progress: getDayProgress(),
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.circles}>
          {rings.map((ring) => (
            <div
              className={`${styles.ring} ${ring.className}`}
              key={ring.label}
              style={{ '--progress': ring.progress } as React.CSSProperties}
            >
              <div className={styles.ringInner} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        {rings.reverse().map((ring) => (
          <span
            className={`${styles.legendItem} ${ring.className}`}
            key={ring.label}
          >
            <span className={styles.legendDot} />
            {ring.label}
          </span>
        ))}
      </div>
    </>
  );
};

export default TimeProgress;
