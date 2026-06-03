// Hooks
import { useStreakQuery } from '../../hooks/useStreakQuery';

// Styles
import styles from './Streak.module.scss';

const Streak = () => {
  const { data: streak } = useStreakQuery();

  return (
    <>
      {streak.streak > 1 ? (
        <div>
          <span>{streak.streak} days in a row!</span>

          <span className={styles.leniencyCounter}>
            {streak.daysSinceLast > 0 ? streak.daysSinceLast : ''}
          </span>
        </div>
      ) : streak.streak === 0 ? (
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
