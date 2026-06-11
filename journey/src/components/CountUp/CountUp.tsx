// External
import type { Easing } from 'motion/react';
import { animate, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useEffect, useRef } from 'react';

// Styles
import styles from './CountUp.module.scss';

type Props = {
  countTo: number;
  delay?: number;
  duration?: number;
  ease?: Easing;
};

const CountUp = ({
  countTo,
  delay = 0.3,
  duration = 1,
  ease = 'easeIn',
}: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, countTo, {
      delay,
      duration,
      ease,
    });
    return controls.stop;
  }, [countTo, delay, duration, ease, motionValue]);

  useMotionValueEvent(motionValue, 'change', (latest) => {
    if (ref.current) {
      ref.current.textContent = String(Math.floor(latest));
    }
  });

  return (
    <span className={styles.container}>
      <span className={styles.shadowCounter}>{countTo}</span>

      <span className={styles.counter} ref={ref} />
    </span>
  );
};

export default CountUp;
