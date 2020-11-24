import React from 'react';

// Styling
import styles from './Divider.module.scss';

type Props = {
  text?: string;
};

const Divider = (props: Props) => (
  <div className={styles.divider} {...props}>
    <hr className={styles.ruler} />
    {props.text && (
      <span className={styles.mask}>
        <span className={styles.text}>{props.text}</span>
      </span>
    )}
  </div>
);

export default Divider;
