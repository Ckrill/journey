import React from 'react';

// Components
import Divider from '../Divider/Divider';
import Button from '../Button/Button';

// Styling
import styles from './Workout.module.scss';

const doneSynonyms = [
  'Done!',
  'Bam!',
  'High five!',
  "That's all?",
  'Finished those',
  'Yeah!',
  "What's next?",
];

const Workout = ({ exercise, program, handleClick }: any) => {
  console.log('exercise: ', exercise);
  console.log('program: ', program);

  return (
    <>
      <Divider text={exercise.name} data-appearance="faint" />
      <ul className={styles.sets}>
        {program.sets.map((set: number, key: number, sets: any) => {
          const isLastSet = key + 1 === sets.length;

          return (
            <li className={styles.set} key={key}>
              <div className={styles.reps}>
                {set}
                {isLastSet && '+'} {exercise.name}
              </div>

              {!isLastSet && (
                <div className={styles.rest}>
                  Rest for {program.rest} seconds.
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Button
        onClick={() => {
          handleClick(exercise);
        }}
      >
        {doneSynonyms[Math.floor(Math.random() * doneSynonyms.length)]}
      </Button>
      {/* <Button
        onClick={() => {
          console.log('Skip');
        }}
        data-priority="secondary"
      >
        Skip
      </Button> */}
    </>
  );
};

export default Workout;
