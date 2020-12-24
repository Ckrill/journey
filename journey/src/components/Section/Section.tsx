import React from 'react';

// Styles
import styles from './Section.module.scss';

const Section = (props: any) => (
  <div className={styles.section}>{props.children}</div>
);

export default Section;
