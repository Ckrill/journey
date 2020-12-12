import React, { useEffect, useState } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { primeWorkouts } from '../../helpers/dataHandler';
import { getFromLocalStorage } from '../../helpers/localStorage';
import { get, getItemsByType } from '../../helpers/requests';
import { calculateStreak } from '../../helpers/streak';
import { getHeading } from '../../helpers/synonyms';

// Components
import Spinner from '../Spinner/Spinner';

// Styles
import styles from './Feedback.module.scss';

// Types
import { User, Workouts } from '../../types/types';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
};

const getWorkouts = () => get(getItemsByType('workout'));

const Feedback = ({ setShow, show }: Props) => {
  const [firstRender, setFirstRender] = useState(true);
  const [heading, setHeading] = useState('Sick');
  const [isLoaded, setIsLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | []>([]);

  useEffect(() => {
    if (!streak) return;

    setHeading(getHeading(feedbackHeading, streak));
  }, [streak]);

  useEffect(() => {
    if (!firstRender) return;

    const user = getFromLocalStorage('user');
    setUser(user);

    getWorkouts().then((workoutsCrude) => {
      const workouts = primeWorkouts(workoutsCrude);

      setIsLoaded(true);
      setWorkouts(workouts);
    });

    setFirstRender(false);
  }, [firstRender]);

  useEffect(() => {
    if (!workouts) return;

    const streak = calculateStreak(user, workouts);

    setStreak(streak);
  }, [user, workouts]);

  return !isLoaded ? (
    <Spinner loadingMessage="Retrieving videos from the archive..." />
  ) : (
    <div
      className={`${styles.overlay} ${show && styles.show}`}
      onClick={() => setShow(false)}
    >
      <div className={styles.container}>
        {streak ? (
          <>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.paragraph}>{streak} days in a row</p>
          </>
        ) : (
          <>
            {/* <h1 className={styles.heading}>Inception</h1> */}
            <h1 className={styles.heading}>Departure</h1>
            <p className={styles.paragraph}>
              Today you embarked on your journey
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
