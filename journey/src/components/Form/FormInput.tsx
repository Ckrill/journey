import React from 'react';

// Styling
import styles from './FormInput.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  errorText?: string;
  labelText: string;
};

const FormInput = React.forwardRef(
  (
    { errorText, labelText, ...props }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={props.id}>
        {labelText}
      </label>
      <input
        className={`${styles.input} ${errorText ? styles['input--error'] : ''}`}
        id={props.id}
        {...props}
        ref={ref}
      />
      <p className={styles.error}>{errorText}</p>
    </div>
  )
);

export default FormInput;
