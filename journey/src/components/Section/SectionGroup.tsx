import React from 'react';

// Styling
import styles from './Section.module.scss';

type Props = {
  children: React.ReactNode;
};

const SectionGroup = (props: Props) => (
  <div className={styles.group}>{props.children}</div>
);

export default SectionGroup;
