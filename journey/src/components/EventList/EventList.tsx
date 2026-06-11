// External
import { AnimatePresence, motion } from 'motion/react';
import { Fragment, useState } from 'react';

// Utilities
import {
  categorizeByYearAndMonth,
  type Month,
  type Year,
} from '../../helpers/categorizer';

// Miscellaneous
import Divider from '../Divider/Divider';
import Event from './Event';
import { variants } from './eventTransition';

// Types
import type { Events } from '../../types/types';

// Styles
import styles from './EventList.module.scss';

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
            <Divider data-appearance="faint" text={String(year.year)} />
          )}

          <AnimatePresence>
            {year.months.map((month: Month) => (
              <motion.div
                animate="animate"
                exit="exit"
                initial="initial"
                key={month.month}
                transition={{
                  duration: 0.2,
                  when: 'beforeChildren',
                }}
                variants={variants}
              >
                <Divider data-appearance="faint" text={month.month} />

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
