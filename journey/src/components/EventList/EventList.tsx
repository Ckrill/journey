import { Fragment } from 'react';
import { motion } from 'framer-motion';

// Settings
import { variants } from './eventTransition';

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
import { Event as EventType, Events } from '../../types/types';

type Props = {
  events: Events;
};

const EventList = ({ events }: Props) => {
  const eventsByYear: Year[] = categorizeByYearAndMonth(events) || [];
  const currentYear = new Date().getFullYear();
  let overallIndex = 0;

  // TODO: Is this a custom hook instead of a helper?
  // TODO: Use useMemo to set the state.

  return (
    <div className={styles['event-list']}>
      {eventsByYear.map((year: Year) => (
        <Fragment key={year.year}>
          {Number(year.year) !== currentYear && (
            <Divider text={String(year.year)} data-appearance="faint" />
          )}

          {year.months.map((month: Month) => (
            <motion.div
              key={month.month}
              initial="initial"
              animate="animate"
              variants={variants}
              transition={{
                duration: 0.2,
                when: 'beforeChildren',
              }}
            >
              <Divider text={month.month} data-appearance="faint" />

              {month.events.map((event: EventType) => {
                overallIndex++;

                return (
                  <Event
                    event={event}
                    key={event.id}
                    overallIndex={overallIndex - 1}
                  />
                );
              })}
            </motion.div>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default EventList;
