import { Fragment, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Settings
import { variants } from './eventTransition';

// Helpers
import {
  categorizeByYearAndMonth,
  Month,
  Year,
} from '../../helpers/categorizer';
import { calculateStreak } from '../../helpers/streak';

// Components
import Event from './Event';
import Divider from '../Divider/Divider';

// Contexts
import { useUser } from '../../contexts/userContext';
import { useEvents, useEventsUpdate } from '../../contexts/eventsContext';
import { useStreakUpdate } from '../../contexts/streakContext';

// Styling
import styles from './EventList.module.scss';

// Types
import { Event as EventType, Events } from '../../types/types';

type Props = {
  eventsToShow: Events;
};

const EventList = ({ eventsToShow }: Props) => {
  const user = useUser();
  const events = useEvents();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();

  const eventsByYear: Year[] = categorizeByYearAndMonth(eventsToShow) || [];
  const currentYear = new Date().getFullYear();
  let overallIndex = 0;

  const [deletionQueue, setDeletionQueue] = useState<any[]>([]);

  const addToDeletionQueue = (id: string) => {
    const newDeletionQueue = [...deletionQueue];
    newDeletionQueue.push(id);

    setDeletionQueue(newDeletionQueue);
  };

  useEffect(() => {
    if (!deletionQueue.length) return;

    const id = deletionQueue[0];
    console.log('id: ', id);
    const eventsNew = [...events];
    const index = events.findIndex((event) => id === event.id);

    const newDeletionQueue = [...deletionQueue];
    newDeletionQueue.splice(0, 1);
    setDeletionQueue(newDeletionQueue);

    if (index === -1) return;

    eventsNew.splice(index, 1);
    setEvents(eventsNew);

    const streak = calculateStreak(user, eventsNew);
    setStreak(streak);
  }, [deletionQueue, events, setEvents, setStreak, user]);

  return (
    <div className={styles.container}>
      {eventsByYear.map((year: Year) => (
        <Fragment key={year.year}>
          {Number(year.year) !== currentYear && (
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
                  {month.events.map((event: EventType) => {
                    overallIndex++;

                    return (
                      <Event
                        addToDeletionQueue={addToDeletionQueue}
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
