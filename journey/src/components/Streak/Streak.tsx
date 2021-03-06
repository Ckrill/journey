import React, { useEffect, useState } from 'react';

import constants from '../../settings/constants';

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
    setLeniency(constants.leniency - streak.leniency);
  }, [user, workouts]);

  return (
    <>
      {streak > 1 && (
        <div>
          <span>{streak} days in a row!</span>
          {leniency ? (
            <span className={styles.leniencyCounter}>-{leniency}</span>
          ) : (
            ''
          )}
        </div>
      )}
    </>
  );
};

export default Streak;
