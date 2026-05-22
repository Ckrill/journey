import React from 'react';

// Styling
import styles from './Input.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  errorText?: string;
  id: string;
  labelText: string;
};

const FormInput = ({ errorText, labelText, ...props }: Props) => (
  <div className={styles.container}>
    <label className={styles.label} htmlFor={props.id}>
      {labelText}
    </label>

    <input
      className={`${styles.input} ${errorText ? styles['input--error'] : ''}`}
      {...props}
    />

    <p className={styles.error}>{errorText}</p>
  </div>
);

export default FormInput;
