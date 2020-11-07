import React from 'react';

// Styling
import styles from './Section.module.css';

const SectionGroup = (props: any) => (
  <div className={styles.group}>{props.children}</div>
);

export default SectionGroup;
