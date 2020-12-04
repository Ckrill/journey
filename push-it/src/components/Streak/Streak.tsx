import React, { useEffect, useState } from 'react';

// Components
//import Component from './react/components/Component';

// Styles
// import styles from './Streak.module.scss';

// Types
import { User, Workouts } from '../../types/types';

type Props = { user: User | null; workouts: Workouts };

const Streak = ({ user, workouts }: Props) => {
  const [earliestStreakDate, setEarliestStreakDate] = useState(
    new Date().toDateString()
  );
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const myWorkouts = workouts.filter((item) => {
      return item.user?.id === user?.id;
    });

    let earliestStreakDate: string = new Date().toDateString();

    myWorkouts.some((item) => {
      const date = new Date(item.date);
      const day = date.toDateString();

      const tomorrow = new Date(item.date);
      new Date(tomorrow.setDate(tomorrow.getDate() + 1));
      const tomorrowDay = tomorrow.toDateString();

      if (earliestStreakDate === day || earliestStreakDate === tomorrowDay) {
        earliestStreakDate = day;

        // Keep counting
        return false;
      } else {
        // Stop the count!
        return true;
      }
    });

    setEarliestStreakDate(earliestStreakDate);
  }, [user?.id, workouts]);

  useEffect(() => {
    const today = new Date();
    const diffDays = Math.round(
      Math.abs(
        (Number(today) - Number(new Date(earliestStreakDate))) /
          (24 * 60 * 60 * 1000)
      )
    );

    setStreak(diffDays);
  }, [earliestStreakDate]);

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
