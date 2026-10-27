// External
import clsx from 'clsx';
import React from 'react';
import { BsCheck, BsChevronDown } from 'react-icons/bs';

// Miscellaneous
import FieldLabel from '../FieldLabel/FieldLabel';
import FieldMessage from '../FieldMessage/FieldMessage';

// Styles
import styles from './Select.module.scss';

interface Option {
  disabled?: boolean;
  label: string;
  value: number | string;
}

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  assistiveText?: string;
  errorText?: string;
  id: string;
  labelText: string;
  options: Option[];
  placeholder?: string;
};

const FormSelect = ({
  assistiveText,
  errorText,
  labelText,
  options,
  placeholder,
  required,
  ...props
}: Props) => (
  <div className={styles.container}>
    <FieldLabel htmlFor={props.id} required={required}>
      {labelText}
    </FieldLabel>

    <div className={styles.field}>
      <select
        aria-invalid={errorText ? true : undefined}
        aria-required={required}
        className={clsx(styles.select, errorText && styles['select--error'])}
        required={required}
        {...props}
      >
        {placeholder && (
          <option disabled={required} value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            disabled={option.disabled}
            key={option.value}
            value={option.value}
          >
            {option.label}
            <BsCheck aria-hidden className={styles.check} />
          </option>
        ))}
      </select>

      <BsChevronDown aria-hidden className={styles.chevron} />
    </div>

    <FieldMessage assistiveText={assistiveText} errorText={errorText} />
  </div>
);

export default FormSelect;
