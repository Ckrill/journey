import React from 'react';

// Helpers
import { getMonthDay } from '../../helpers/dateFormatting';

// Data
// import trainingPlan from '../../data/training-plan.json';

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

const Table = (event: EventType) => (
  <table className={styles.table}>
    <tbody>
      {event.exercises.map(
        (
          { name, reps }: { name: string; reps?: number | boolean },
          key: number
        ) => {
          return (
            <tr key={key}>
              <td className={styles.key}>{name}</td>
              <td className={styles.value}>{reps ? reps : '✓'}</td>
            </tr>
          );
        }
      )}
    </tbody>
  </table>
);

type Program = {
  week: number;
  difficulty: number;
  day: number;
};
type Exercise = { name: string; program?: Program; reps?: number };
type Exercises = Exercise[];
type EventType = {
  date: Date;
  exercises: Exercises;
  message?: string;
  type: string;
};
type Props = { event: EventType };

const Event = ({ event }: Props) => {
  const isWorkout = event.type === 'Workout';
  const isTest = event.type === 'Test';

  return (
    <div className={styles.event} data-type={event.type}>
      <header className={styles.header}>
        <div className={styles.type}>{event.type}</div>

        <div className={styles.date}>
          <span>{getMonthDay(new Date(event.date), 'en-us')}</span>
        </div>
      </header>
      {(isTest || isWorkout) && <Table {...event} />}
      {event.message && <p>{event.message}</p>}
    </div>
  );
};

export default Event;
