import React, { useEffect, useState } from 'react';

// Helpers
import { calculateStreak } from '../../helpers/streak';

// Styles
import styles from './Streak.module.scss';

// Types
import { User, Workouts } from '../../types/types';

type Props = { user: User | null; workouts: Workouts };

const Streak = ({ user, workouts }: Props) => {
  const [streak, setStreak] = useState(0);
  const [leniency, setLeniency] = useState(0);

  useEffect(() => {
    if (!workouts) return;

    const streak = calculateStreak(user, workouts);

    setStreak(streak.streak);
    setLeniency(streak.leniency);
  }, [user, workouts]);

  return (
    <>
      {streak > 1 ? (
        <div>
          <span>{streak} days in a row!</span>

          <span className={styles.leniencyCounter}>
            {leniency ? leniency : ''}
          </span>
        </div>
      ) : (
        <div>
          <span>Good to see you!</span>
          {/* <span>Let's get started!</span> */}
          <span className={styles.leniencyCounter}></span>
        </div>
      )}
    </>
  );
};

export default Streak;
