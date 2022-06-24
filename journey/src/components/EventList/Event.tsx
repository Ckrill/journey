import { useEffect, useState } from 'react';
import { BiTrash as Trash } from 'react-icons/bi';
import { motion } from 'framer-motion';

// Settings
import { variants } from './eventTransition';

// Helpers
import { getMonthDay } from '../../helpers/dateFormatting';
import deleteEntry from '../../helpers/deleteEntry';
import { calculateStreak } from '../../helpers/streak';

// Contexts
import { useUser } from '../../contexts/userContext';
import { useEvents, useEventsUpdate } from '../../contexts/eventsContext';
import { useStreakUpdate } from '../../contexts/streakContext';

// Types
import { Event as EventType } from '../../types/types';

// Styling
import styles from './Event.module.scss';

type Props = {
  event: EventType;
  overallIndex: number;
};

const Event = ({ event, overallIndex }: Props) => {
  const user = useUser();
  const events = useEvents();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();

  const [isDeleted, setIsDeleted] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const mine = event.user?.id === user?.id;

    if (isMine === mine) return;
    setIsMine(mine);
  }, [event, isMine, user]);

  const deleteEvent = (id: string) => {
    const result = [...events];
    const index = events.findIndex((event) => id === event.id);

    if (index === -1) return;

    result.splice(index, 1);
    setEvents(result);

    const streak = calculateStreak(user, result);
    setStreak(streak);
  };

  const deleteEventCallback = () => {
    deleteEvent(event.id);
  };

  return (
    <motion.div
      className={`${styles.event} ${isMine ? styles['event--mine'] : ''} ${
        showOptions ? styles['event--show-options'] : ''
      } ${isDeleted ? styles['event--deleted'] : ''}`}
      onClick={() => setShowOptions(isMine && !showOptions)}
      variants={variants}
      transition={{
        duration: 0.2,
        delay: ((overallIndex % 10) * 5) / 100,
      }}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.name}>{event.name}</div>

          <div className={styles.meta}>
            <div className={styles.user}>{event.user?.name}</div>

            <div className={styles.date}>
              {getMonthDay(new Date(event.date), 'en-us')}
            </div>
          </div>
        </header>

        <div className={`${styles.options}`}>
          <Trash
            onClick={(e) => {
              if (!event.id) return;

              e.stopPropagation();
              setIsDeleted(true);
              deleteEntry(event.id, () => deleteEventCallback());
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Event;
