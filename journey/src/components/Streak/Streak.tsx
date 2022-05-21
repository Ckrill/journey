import { useEffect, useState } from 'react';

// Helpers
import { calculateStreak } from '../../helpers/streak';

// Contexts
import { useUser } from '../../contexts/userContext';
import { useEvents } from '../../contexts/eventsContext';

// Styles
import styles from './Streak.module.scss';

const Streak = () => {
  const user = useUser();
  const events = useEvents();
  const [streak, setStreak] = useState(-1);
  const [leniency, setLeniency] = useState(0);

  useEffect(() => {
    if (!events) return;

    const streak = calculateStreak(user, events);

    setStreak(streak.streak);
    setLeniency(streak.leniency);
  }, [user, events]);

  return (
    <>
      {streak > 1 ? (
        <div>
          <span>{streak} days in a row!</span>

          <span className={styles.leniencyCounter}>
            {leniency ? leniency : ''}
          </span>
        </div>
      ) : streak === 0 ? (
        <div>
          <span>Good to see you!</span>
          {/* <span>Let's get started!</span> */}
          <span className={styles.leniencyCounter}></span>
        </div>
      ) : (
        <div>
          <span></span>

          <span className={styles.leniencyCounter}></span>
        </div>
      )}
    </>
  );
};

export default Streak;
