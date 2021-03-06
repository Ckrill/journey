import React, { useEffect, useState } from 'react';
import { BiTrash as Trash } from 'react-icons/bi';

// Helpers
import { getMonthDay } from '../../helpers/dateFormatting';
import deleteEntry from '../../helpers/deleteEntry';

// Data
// import trainingPlan from '../../data/training-plan.json';

// Types
import { User, Workout } from '../../types/types';

// Styling
import styles from './Event.module.scss';

// const getReps = (workout: any) => {
//   const program = workout.exercises[0].program;
//   if (!program) return null;

//   const sets =
//     trainingPlan.weeks[program.week].difficulties[program.difficulty].days[
//       program.day
//     ].sets;
//   const reps = sets.reduce((a, b) => a + b, 0);

//   return reps;
// };

// const Table = (event: EventType) => (
//   <table className={styles.table}>
//     <tbody>
//       {event.exercises?.map(
//         (
//           { name, reps }: { name: string; reps?: number | boolean },
//           key: number
//         ) => {
//           return (
//             <tr key={key}>
//               <td className={styles.key}>{name}</td>
//               <td className={styles.value}>{reps ? reps : '✓'}</td>
//             </tr>
//           );
//         }
//       )}
//     </tbody>
//   </table>
// );

type Props = { event: Workout; user: User | null };

const Event = ({ event, user }: Props) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  // const isWorkout = event.type === 'Workout';
  // const isTest = event.type === 'Test';

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
      // data-type={event.type}
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
        {/* {(isTest || isWorkout) && <Table {...event} />} */}
        {/* {event.message && <p>{event.message}</p>} */}
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
