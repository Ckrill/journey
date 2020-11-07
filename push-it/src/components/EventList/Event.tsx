import React from 'react';

// Helpers
import { getMonthDay } from '../../helpers/dateFormatting';

// Data
import trainingPlan from '../../data/training-plan.json';

// Styling
import styles from './Event.module.css';

const getReps = (workout: any) => {
  const program = workout.exercises[0].program;
  if (!program) return null;

  const sets =
    trainingPlan.weeks[program.week].difficulties[program.difficulty].days[
      program.day
    ].sets;
  const reps = sets.reduce((a, b) => a + b, 0);

  return reps;
};

const Table = (event: any) => (
  <table className={styles.table}>
    <thead className={styles['table-head']}>
      <tr>
        <td className={styles.key}>Exercise</td>
        <td className={styles.value}>Reps</td>
      </tr>
    </thead>
    <tbody>
      {event.exercises.map(
        (
          { name, reps }: { name: string; reps: number | boolean },
          key: number
        ) => {
          return (
            <tr key={key}>
              <td className={styles.key}>{name}</td>
              <td className={styles.value}>{reps}</td>
            </tr>
          );
        }
      )}
    </tbody>
  </table>
);

const Event = (props: any) => {
  const { event } = props;
  const isWorkout = event.type === 'Workout';
  const isTest = event.type === 'Test';

  return (
    <div className={styles.event} data-type={event.type}>
      <header className={styles.header}>
        <div className={styles.type}>{event.type}</div>

        {isWorkout && (
          <div className={styles.totalReps}>{getReps(event)} reps</div>
        )}

        <div className={styles.date}>
          <span>{getMonthDay(new Date(event.date), 'en-us')}</span>
        </div>
      </header>
      {isTest && <Table {...event} />}
      {event.message && <p>{event.message}</p>}
    </div>
  );
};

export default Event;
