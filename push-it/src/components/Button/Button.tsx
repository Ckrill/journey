import React from 'react';

// Styles
import styles from './Button.module.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Props) => (
  <button className={styles.button} {...props}>
    {props.children}
  </button>
);

export default Button;
