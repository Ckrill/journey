// External
import clsx from 'clsx';
import React from 'react';

// Miscellaneous
import FieldLabel from '../FieldLabel/FieldLabel';
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
    <FieldLabel htmlFor={props.id} required={required}>
      {labelText}
    </FieldLabel>

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
