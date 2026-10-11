// External
import React from 'react';

// Styles
import styles from './Section.module.scss';

interface Props {
  children: React.ReactNode;
}

const Section = (props: Props) => (
  <div className={styles.section}>{props.children}</div>
);

export default Section;
