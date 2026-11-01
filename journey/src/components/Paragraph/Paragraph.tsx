// External
import React from 'react';

// Styles
import styles from './Paragraph.module.scss';

interface Props {
  align?: 'left';
  children: React.ReactNode;
  size?: 'fine';
  type?: 'warning';
}

const Paragraph = ({ align, children, size, type }: Props) => (
  <p
    className={styles.paragraph}
    data-align={align}
    data-size={size}
    data-type={type}
  >
    {children}
  </p>
);

export default Paragraph;
