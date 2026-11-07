// External
import React from 'react';

// Styles
import styles from './Paragraph.module.scss';

interface Props {
  align?: 'left';
  children: React.ReactNode;
  role?: 'alert';
  size?: 'fine';
}

const Paragraph = ({ align, children, role, size }: Props) => (
  <p
    className={styles.paragraph}
    data-align={align}
    data-size={size}
    role={role}
  >
    {children}
  </p>
);

export default Paragraph;
