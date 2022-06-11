import { Fragment } from 'react';
import { motion, Variants } from 'framer-motion';

// Helpers
import {
  categorizeByYearAndMonth,
  Month,
  Year,
} from '../../helpers/categorizer';

// Components
import Event from './Event';
import Divider from '../Divider/Divider';

// Styling
import styles from './EventList.module.scss';

// Types
import { Workout, Workouts } from '../../types/types';

type Props = {
  events: Workouts;
};

const variants: Variants = {
  initial: { opacity: 0, translateY: 15 },
  animate: { opacity: 1, translateY: 0 },
};

const EventList = ({ events }: Props) => {
  const eventsByYear: Year[] = categorizeByYearAndMonth(events) || [];
  const currentYear = new Date().getFullYear();

  // TODO: Is this a custom hook instead of a helper?
  // TODO: Use useMemo to set the state.

  return (
    <div className={styles['event-list']}>
      {eventsByYear.map((year: Year) => (
        <Fragment key={year.year}>
          {Number(year.year) !== currentYear && (
            <Divider text={String(year.year)} data-appearance="faint" />
          )}

          {year.months.map((month: Month, i: number) => (
            <Fragment key={month.month}>
              <motion.div
                key={month.month}
                initial="initial"
                animate="animate"
                variants={variants}
                transition={{
                  duration: 0.2,
                  delay: i ? 1 : 0,
                  when: 'beforeChildren',
                }}
              >
                <Divider text={month.month} data-appearance="faint" />

                {month.workouts.map((event: Workout, i: number) => (
                  <motion.div
                    key={event.id}
                    variants={variants}
                    transition={{ duration: 0.2, delay: 0.05 * i }}
                  >
                    <Event event={event} key={event.id} />
                  </motion.div>
                ))}
              </motion.div>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default EventList;
