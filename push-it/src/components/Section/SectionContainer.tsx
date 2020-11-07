import React from 'react';

// Styling
import styles from './Section.module.css';

const SectionContainer = (props: any) => (
  <div className={styles.container}>{props.children}</div>
);

export default SectionContainer;
