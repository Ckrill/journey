import React from 'react';

// Styling
import styles from './Heading.module.scss';

type Props = {
  children: React.ReactNode;
};

const Heading = (props: Props) => (
  <h2 className={styles.heading}>{props.children}</h2>
);

export default Heading;
