// External
import { type HTMLMotionProps, motion } from 'motion/react';

// Styles
import styles from './Spinner.module.scss';

const Spinner = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    animate={{ opacity: 1 }}
    aria-label="Loading"
    className={styles.spinner}
    initial={{ opacity: 0 }}
    role="progressbar"
    transition={{ delay: 1, duration: 0.5, ease: 'easeInOut' }}
    {...props}
  />
);

export default Spinner;
