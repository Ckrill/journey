// External
import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';

// Miscellaneous
import FieldMessage from '../FieldMessage/FieldMessage';

// Styles
import labelStyles from '../FieldLabel/FieldLabel.module.scss';
import styles from './Pillbox.module.scss';

export interface PillboxOption {
  /** What the cell shows. Defaults to `label`. */
  display?: ReactNode;
  /** Full accessible name, announced by screen readers. */
  label: string;
  value: string;
}

// The input props go on every checkbox, so the group submits as one named field.
type Props = InputHTMLAttributes<HTMLInputElement> & {
  assistiveText?: string;
  errorText?: string;
  labelText: string;
  options: readonly PillboxOption[];
};

const Pillbox = ({
  assistiveText,
  disabled,
  errorText,
  labelText,
  options,
  ...props
}: Props) => (
  <fieldset className={styles.container} disabled={disabled}>
    <legend className={clsx(labelStyles.label, styles.legend)}>
      {labelText}
    </legend>

    <div className={styles.pill}>
      {options.map((option) => (
        <label className={styles.option} key={option.value}>
          <input
            {...props}
            aria-label={option.label}
            className={styles.input}
            type="checkbox"
            value={option.value}
          />
          <span className={styles.face}>{option.display ?? option.label}</span>
        </label>
      ))}
    </div>

    <FieldMessage assistiveText={assistiveText} errorText={errorText} />
  </fieldset>
);

export default Pillbox;
