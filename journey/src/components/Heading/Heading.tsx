// External
import React from 'react';

// Styles
import styles from './Heading.module.scss';

interface Props {
  children: React.ReactNode;
  level?: 1 | 2;
  /** Keeps the heading in the accessibility tree without showing or spacing it. */
  visuallyHidden?: boolean;
}

const Heading = ({ children, level = 2, visuallyHidden }: Props) => {
  const Tag = level === 1 ? 'h1' : 'h2';

  return (
    <Tag className={visuallyHidden ? styles.visuallyHidden : styles.heading}>
      {children}
    </Tag>
  );
};

export default Heading;
