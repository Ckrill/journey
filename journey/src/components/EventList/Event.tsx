import { useState } from 'react';
import { BiTrash as Trash } from 'react-icons/bi';
import { RiErrorWarningLine as Warning } from 'react-icons/ri';
import { motion } from 'framer-motion';

// Settings
import { variants } from './eventTransition';

// Helpers
import { formatDate } from '../../helpers/dateFormatting';

// Hooks
import { useDeleteEvent } from '../../hooks/useDeleteEvent';

// Contexts
import { useUser } from '../../contexts/userContext';

// Types
import type { Event as EventType } from '../../types/types';

// Styling
import styles from './Event.module.scss';

type Props = {
  event: EventType;
  overallIndex: number;
};

const Event = ({ event, overallIndex }: Props) => {
  const user = useUser();
  const deleteEvent = useDeleteEvent();

  const [showOptions, setShowOptions] = useState(false);

  const isMine = event.user.id === user?.id;

  return (
    <motion.div
      className={`${styles.event} ${isMine ? styles['event--mine'] : ''} ${
        showOptions ? styles['event--show-options'] : ''
      } ${deleteEvent.isPending ? styles['event--deleted'] : ''}`}
      onClick={() => {
        setShowOptions(isMine && !showOptions);
      }}
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
            <div className={styles.user}>{event.user.name}</div>

            <div className={styles.date}>
              {formatDate(new Date(event.date), 'monthDay')}
            </div>
          </div>
        </header>

        <div
          className={`${styles.options} ${
            deleteEvent.isError ? styles['options--warning'] : ''
          }`}
        >
          {deleteEvent.isError ? (
            <Warning
              onClick={(e) => {
                if (!event.id) return;

                e.stopPropagation();
                deleteEvent.reset();
              }}
            />
          ) : (
            <Trash
              onClick={(e) => {
                if (!event.id) return;

                e.stopPropagation();
                deleteEvent.mutate(event.id);
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Event;
