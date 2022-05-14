import { useEffect, useState } from 'react';
import { BiTrash as Trash } from 'react-icons/bi';

// Helpers
import { getMonthDay } from '../../helpers/dateFormatting';
import deleteEntry from '../../helpers/deleteEntry';

// Types
import { User, Workout } from '../../types/types';

// Styling
import styles from './Event.module.scss';

type Props = { event: Workout; user: User | null };

const Event = ({ event, user }: Props) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const mine = event.user?.id === user?.id;

    if (isMine === mine) return;
    setIsMine(mine);
  }, [event, isMine, user]);

  return (
    <div
      className={`${styles.event} ${isMine ? styles['event--mine'] : ''} ${
        showOptions ? styles['event--show-options'] : ''
      } ${isDeleted ? styles['event--deleted'] : ''}`}
      onClick={() => setShowOptions(isMine && !showOptions)}
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
              deleteEntry(event.id, setIsDeleted(true));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;
