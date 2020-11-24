import React from 'react';

// Styling
import styles from './Paragraph.module.scss';

const Paragraph = (props: any) => (
  <p className={styles.paragraph} {...props}>
    {props.children}
  </p>
);

export default Paragraph;
