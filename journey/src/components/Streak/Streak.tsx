import React, { useEffect, useState } from 'react';

// Helpers
import { calculateStreak } from '../../helpers/streak';

// Styles
// import styles from './Streak.module.scss';

// Types
import { User, Workouts } from '../../types/types';

type Props = { user: User | null; workouts: Workouts };

const Streak = ({ user, workouts }: Props) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!workouts) return;

    const streak = calculateStreak(user, workouts);

    setStreak(streak);
  }, [user, workouts]);

  return (
    <>
      {streak > 1 && (
        <div>
          <span>{streak} days in a row!</span>
        </div>
      )}
    </>
  );
};

export default Streak;
