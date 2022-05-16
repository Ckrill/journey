import { useEffect, useState } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { calculateStreak } from '../../helpers/streak';
import { getHeading, getHeadingSize } from '../../helpers/synonyms';

// Styles
import styles from './Feedback.module.scss';

// Types
import { User, Workouts } from '../../types/types';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
  user: User;
  workouts: Workouts | [];
};

const Feedback = ({ setShow, show, user, workouts }: Props) => {
  const [heading, setHeading] = useState('');
  const [headingSize, setHeadingSize] = useState('m');
  const [streak, setStreak] = useState(0);

  // Get heading.
  useEffect(() => {
    if (!show || !streak) return;

    const heading = getHeading(feedbackHeading, streak);
    const headingSize = getHeadingSize(heading);

    setHeading(heading);
    setHeadingSize(headingSize);
  }, [show, streak]);

  // Get streak.
  useEffect(() => {
    if (!workouts.length) return;

    const newStreak = calculateStreak(user, workouts);

    // TODO: Use memo instead of this check.
    if (streak === newStreak.streak) return;

    setStreak(newStreak.streak);
  }, [streak, user, workouts]);

  return (
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
