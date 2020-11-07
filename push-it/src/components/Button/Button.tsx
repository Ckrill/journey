import React from 'react';

// Styles
import styles from './Button.module.css';

const Button = (props: any) => (
  <button className={styles.button} {...props}>
    {props.children}
  </button>
);

export default Button;
