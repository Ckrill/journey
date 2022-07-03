import { useEffect, useState } from 'react';
import { BiTrash as Trash } from 'react-icons/bi';
import { RiErrorWarningLine as Warning } from 'react-icons/ri';
import { motion } from 'framer-motion';

// Settings
import { variants } from './eventTransition';

// Helpers
import { getMonthDay } from '../../helpers/dateFormatting';
import deleteEntry from '../../helpers/deleteEntry';

// Contexts
import { useUser } from '../../contexts/userContext';

// Types
import { Event as EventType } from '../../types/types';

// Styling
import styles from './Event.module.scss';

type Props = {
  addToDeletionQueue: (id: string) => void;
  event: EventType;
  overallIndex: number;
};

const Event = ({ addToDeletionQueue, event, overallIndex }: Props) => {
  const user = useUser();

  const [isDeleted, setIsDeleted] = useState(false);
  const [hasWarning, setHasWarning] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const mine = event.user?.id === user?.id;

    if (isMine === mine) return;
    setIsMine(mine);
  }, [event, isMine, user]);

  const deleteEventCallback = () => {
    addToDeletionQueue(event.id);
  };

  const deleteEventErrorCallback = () => {
    setIsDeleted(false);
    setHasWarning(true);
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

        <div
          className={`${styles.options} ${
            hasWarning ? styles['options--warning'] : ''
          }`}
        >
          {hasWarning ? (
            <Warning
              onClick={(e) => {
                if (!event.id) return;

                e.stopPropagation();
                setHasWarning(false);
              }}
            />
          ) : (
            <Trash
              onClick={(e) => {
                if (!event.id) return;

                e.stopPropagation();
                setIsDeleted(true);
                deleteEntry(
                  event.id,
                  deleteEventCallback,
                  deleteEventErrorCallback
                );
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Event;
