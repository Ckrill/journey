import React from 'react';

// Styling
import styles from './Paragraph.module.scss';

type Props = {
  children: React.ReactNode;
};

const Paragraph = (props: Props) => (
  <p className={styles.paragraph} {...props}>
    {props.children}
  </p>
);

export default Paragraph;
