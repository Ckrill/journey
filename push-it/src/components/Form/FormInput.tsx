import React from 'react';

// Styling
import styles from './FormInput.module.scss'; // Import css modules stylesheet as styles

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  errorText: string;
  labelText: string;
};

const FormInput = React.forwardRef(
  ({ errorText, labelText, ...props }: Props, ref: any) => (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={props.name}>
        {labelText}
      </label>
      <input
        className={`${styles.input} ${errorText ? styles['input--error'] : ''}`}
        id={props.name}
        {...props}
        ref={ref}
      />
      <p className={styles.error}>{errorText}</p>
    </div>
  )
);

export default FormInput;
