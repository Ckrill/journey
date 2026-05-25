// External
import React from 'react';

// Styles
import styles from './Heading.module.scss';

type Props = {
  children: React.ReactNode;
};

const Heading = ({ children }: Props) => (
  <h2 className={styles.heading}>{children}</h2>
);

export default Heading;
