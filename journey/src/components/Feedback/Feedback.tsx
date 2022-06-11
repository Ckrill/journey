import { useEffect, useState } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { getHeading, getHeadingSize } from '../../helpers/synonyms';

// Contexts

// Styles
import styles from './Feedback.module.scss';
import { useStreak } from '../../contexts/streakContext';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
};

const Feedback = ({ setShow, show }: Props) => {
  const streak = useStreak();

  const [heading, setHeading] = useState('');
  const [headingSize, setHeadingSize] = useState('m');

  // Get heading.
  useEffect(() => {
    if (!show || !streak) return;

    const heading = getHeading(feedbackHeading, streak.streak);
    const headingSize = getHeadingSize(heading);

    setHeading(heading);
    setHeadingSize(headingSize);
  }, [show, streak]);

  return (
    <div
      className={`${styles.overlay} ${show && styles.show}`}
      onClick={() => setShow(false)}
    >
      <div className={styles.container}>
        {streak.streak > 1 ? (
          <>
            <h1
              className={`${styles.heading} ${
                styles['heading--' + headingSize]
              }`}
            >
              {heading}
            </h1>
            <p className={styles.paragraph}>{streak.streak} days in a row</p>
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
