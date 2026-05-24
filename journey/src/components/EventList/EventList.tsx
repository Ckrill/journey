import { Fragment, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Settings
import { variants } from './eventTransition';

// Helpers
import {
  categorizeByYearAndMonth,
  type Month,
  type Year,
} from '../../helpers/categorizer';

// Components
import Event from './Event';
import Divider from '../Divider/Divider';

// Styling
import styles from './EventList.module.scss';

// Types
import type { Events } from '../../types/types';

type Props = {
  eventsToShow: Events;
};

const EventList = ({ eventsToShow }: Props) => {
  const [currentYear] = useState(() => new Date().getFullYear());

  const eventsByYear: Year[] = categorizeByYearAndMonth(eventsToShow);
  let overallIndex = 0;

  return (
    <div className={styles.container}>
      {eventsByYear.map((year: Year) => (
        <Fragment key={year.year}>
          {year.year !== currentYear && (
            <Divider text={String(year.year)} data-appearance="faint" />
          )}

          <AnimatePresence>
            {year.months.map((month: Month) => (
              <motion.div
                key={month.month}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                transition={{
                  duration: 0.2,
                  when: 'beforeChildren',
                }}
              >
                <Divider text={month.month} data-appearance="faint" />

                <div className={styles.eventList}>
                  {month.events.map((event) => {
                    overallIndex++;

                    return (
                      <Event
                        event={event}
                        key={event.id}
                        overallIndex={overallIndex - 1}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </Fragment>
      ))}
    </div>
  );
};

export default EventList;
