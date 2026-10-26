// External
import clsx from 'clsx';
import React from 'react';

// Miscellaneous
import FieldMessage from '../FieldMessage/FieldMessage';

// Styles
import styles from './Input.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  assistiveText?: string;
  errorText?: string;
  id: string;
  labelText: string;
  suffix?: string;
};

const FormInput = ({
  assistiveText,
  errorText,
  labelText,
  required,
  suffix,
  ...props
}: Props) => (
  <div className={styles.container}>
    <label className={styles.label} htmlFor={props.id}>
      {labelText}
      {required && (
        <span aria-hidden className={styles.required}>
          *
        </span>
      )}
    </label>

    <div className={styles.field}>
      <input
        aria-required={required}
        className={clsx(styles.input, errorText && styles['input--error'])}
        {...props}
      />

      {suffix && (
        <span aria-hidden className={styles.suffix}>
          {suffix}
        </span>
      )}
    </div>

    <FieldMessage assistiveText={assistiveText} errorText={errorText} />
  </div>
);

export default FormInput;
