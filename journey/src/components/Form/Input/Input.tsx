// External
import clsx from 'clsx';
import React from 'react';

// Styles
import styles from './Input.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  assistiveText?: string;
  errorText?: string;
  id: string;
  labelText: string;
};

const FormInput = ({
  assistiveText,
  errorText,
  labelText,
  ...props
}: Props) => (
  <div className={styles.container}>
    <label className={styles.label} htmlFor={props.id}>
      {labelText}
    </label>

    <input
      className={clsx(styles.input, errorText && styles['input--error'])}
      {...props}
    />

    {!errorText && <p className={styles.assistive}>{assistiveText}</p>}

    {errorText && <p className={styles.error}>{errorText}</p>}
  </div>
);

export default FormInput;
