import React from 'react';

// Components
import Workout from './Workout';

// Styling
import styles from './WorkoutList.module.scss';
import { getProgram } from '../../helpers/program';

const WorkoutList = (props: any) => {
  const week = 0;
  const day = 0;
  const test = 10;

  const { exercises, workouts, tests, trainingPlan, handleClick } = props;

  const previousProgram = workouts[workouts.length - 1]?.exercises[0]?.program;
  const previousTest = tests[tests.length - 1]?.exercises[0]?.reps;

  const program = getProgram(trainingPlan, previousProgram, previousTest);

  return (
    <>
      {exercises.map((exercise: any, key: number) => (
        <React.Fragment key={key}>
          <div className={styles.progress}>
            {key + 1}/{exercises.length}
          </div>
          <Workout
            day={day}
            exercise={exercise}
            program={program}
            test={test}
            week={week}
            handleClick={handleClick}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default WorkoutList;
