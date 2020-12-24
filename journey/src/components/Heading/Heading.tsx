import React from 'react';

// Styling
import styles from './Heading.module.scss';

const Heading = (props: any) => (
  <h2 className={styles.heading}>{props.children}</h2>
);

export default Heading;
