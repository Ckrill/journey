import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Settings
import { variants } from './transition';

// Styles
import styles from './CountUp.module.scss';

type Props = {
  countTo: number;
  duration?: number;
  exponential?: boolean;
};

const easeOutQuad = (t: number) => t * (2 - t);
const frameDuration = 1000 / 10;

const CountUp = ({ countTo, duration = 500, exponential }: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round(duration / frameDuration);
    const counter = setInterval(() => {
      frame++;
      const progress = exponential
        ? easeOutQuad(frame / totalFrames)
        : frame / totalFrames;
      const newCount = Math.floor(countTo * progress);
      setCount(newCount);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => {
      clearInterval(counter);
    };
  }, [countTo, duration, exponential]);

  return (
    <span className={styles.container}>
      <AnimatePresence>
        <span className={styles.shadowCounter}>{countTo}</span>

        <motion.span
          className={styles.counter}
          key={count}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            duration: frameDuration / 1000,
            ease: 'linear',
          }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default CountUp;
