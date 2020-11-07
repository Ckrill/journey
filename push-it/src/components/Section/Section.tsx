import React from 'react';

// Styles
import styles from './Section.module.css';

const Section = (props: any) => (
  <div className={styles.section}>{props.children}</div>
);

export default Section;
