import React from 'react';

// Styles
import styles from './Section.module.scss';

type Props = {
  children: React.ReactNode;
  spacing?: 'narrow';
};

const Section = (props: Props) => (
  <div className={styles.section}>{props.children}</div>
);

export default Section;
