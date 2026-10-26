// External
import React from 'react';

// Styles
import styles from './Button.module.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...rest }: Props) => (
  <button
    className={styles.button}
    data-priority="primary"
    type="button"
    {...rest}
  >
    {children}
  </button>
);

export default Button;
