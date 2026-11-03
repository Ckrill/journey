// External
import { type HTMLMotionProps, motion } from 'motion/react';

// Styles
import styles from './SignIn.module.scss';

const SectionPage = (props: HTMLMotionProps<'div'>) => (
  <motion.div className={styles.page} {...props} />
);

export default SectionPage;
