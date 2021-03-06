import React, { useEffect, useState } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { primeWorkouts } from '../../helpers/dataHandler';
import { getFromLocalStorage } from '../../helpers/localStorage';
import { get, getItemsByType } from '../../helpers/requests';
import { calculateStreak } from '../../helpers/streak';
import {
  getHeading,
  getHeadingSize,
  getLongestWord,
} from '../../helpers/synonyms';

// Components
import Spinner from '../Spinner/Spinner';

// Styles
import styles from './Feedback.module.scss';

// Types
import { WorkoutsContentful } from '../../types/contentfulTypes';
import { User, Workouts } from '../../types/types';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
};

const getWorkouts = () => get(getItemsByType('workout'));

const Feedback = ({ setShow, show }: Props) => {
  const [firstRender, setFirstRender] = useState(true);
  const [heading, setHeading] = useState('');
  const [headingSize, setHeadingSize] = useState('m');
  const [isLoaded, setIsLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | []>([]);

  useEffect(() => {
    if (!streak) return;

    // TODO: Heading is the same if you submit multiple times without refresh.
    const heading = getHeading(feedbackHeading, streak);
    const longestWord = getLongestWord(heading);
    const headingSize = getHeadingSize(longestWord.length);

    setHeading(heading);
    setHeadingSize(headingSize);
  }, [streak]);

  useEffect(() => {
    if (!firstRender) return;

    const user: User = getFromLocalStorage('user');
    setUser(user);

    // TODO: This returns the workouts array without the new workout. It should add the new workout to a faux workour array and use that array to calculate streak.
    getWorkouts().then((workoutsContentful: WorkoutsContentful) => {
      const workouts: Workouts = primeWorkouts(workoutsContentful);

      setIsLoaded(true);
      setWorkouts(workouts);
    });

    setFirstRender(false);
  }, [firstRender]);

  useEffect(() => {
    if (!workouts) return;

    const newStreak = calculateStreak(user, workouts);

    if (streak === newStreak.streak) return;

    setStreak(newStreak.streak);
  }, [streak, user, workouts]);

  return !isLoaded ? (
    <Spinner loadingMessage="Loading..." />
  ) : (
    <div
      className={`${styles.overlay} ${show && styles.show}`}
      onClick={() => setShow(false)}
    >
      <div className={styles.container}>
        {streak > 1 ? (
          <>
            <h1
              className={`${styles.heading} ${
                styles['heading--' + headingSize]
              }`}
            >
              {heading}
            </h1>
            <p className={styles.paragraph}>{streak} days in a row</p>
          </>
        ) : (
          <>
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
