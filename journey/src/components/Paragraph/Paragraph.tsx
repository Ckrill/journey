// External
import React from 'react';

// Styles
import styles from './Paragraph.module.scss';

interface Props {
  align?: 'left';
  children: React.ReactNode;
  size?: 'fine';
}

const Paragraph = ({ align, children, size }: Props) => (
  <p className={styles.paragraph} data-align={align} data-size={size}>
    {children}
  </p>
);

export default Paragraph;
