import { useEffect, useState } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { calculateStreak } from '../../helpers/streak';
import { getHeading, getHeadingSize } from '../../helpers/synonyms';

// Contexts
import { useUser } from '../../contexts/userContext';
import { useEvents } from '../../contexts/eventsContext';

// Styles
import styles from './Feedback.module.scss';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
};

const Feedback = ({ setShow, show }: Props) => {
  const user = useUser();
  const events = useEvents();
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
    if (!events.length) return;

    const newStreak = calculateStreak(user, events);

    // TODO: Use memo instead of this check.
    if (streak === newStreak.streak) return;

    setStreak(newStreak.streak);
  }, [streak, user, events]);

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
