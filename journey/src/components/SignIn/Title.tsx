// External
import { motion } from 'motion/react';
import React from 'react';

// Miscellaneous
import { layoutTransition } from './transition';

// Styles
import styles from './SignIn.module.scss';

interface Props {
  animate: boolean;
  children: React.ReactNode;
}

// The layout wrapper glides the centered title up when the form takes space below it.
const Title = (props: Props) => {
  return (
    <div className={styles.title}>
      <motion.div
        animate={{ y: props.animate ? 50 : 0 }}
        initial={{ y: 0 }}
        layout="position"
        transition={layoutTransition}
      >
        <div className={styles.titleText}>{props.children}</div>
      </motion.div>
    </div>
  );
};

export default Title;
