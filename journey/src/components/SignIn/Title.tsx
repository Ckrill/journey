import React from 'react';

// Styling
import styles from './SignIn.module.scss';

type Props = {
  children: React.ReactNode;
};

const Statement = (props: Props) => (
  <div className={styles.title}>{props.children}</div>
);

export default Statement;
