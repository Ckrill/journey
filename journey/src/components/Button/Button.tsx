// External
import React from 'react';

// Styles
import styles from './Button.module.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  priority?: 'primary' | 'secondary';
  tone?: 'danger';
};

const Button = ({ children, priority = 'primary', tone, ...rest }: Props) => (
  <button
    className={styles.button}
    data-priority={priority}
    data-tone={tone}
    type="button"
    {...rest}
  >
    {children}
  </button>
);

export default Button;
