import React from 'react';
import { motion } from 'framer-motion';

// Styling
import styles from './SignIn.module.scss';

type Props = {
  children: React.ReactNode;
};

const Title = motion(
  React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => (
    <div className={styles.title} ref={ref}>
      {props.children}
    </div>
  ))
);

export default Title;
