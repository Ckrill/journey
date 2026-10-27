// External
import clsx from 'clsx';

// Miscellaneous
import FieldMessage from '../FieldMessage/FieldMessage';

// Styles
import labelStyles from '../FieldLabel/FieldLabel.module.scss';
import styles from './Pillbox.module.scss';

export interface PillboxOption<T extends string> {
  /** What the cell shows. Defaults to `label`. */
  display?: React.ReactNode;
  /** Full accessible name, announced by screen readers. */
  label: string;
  value: T;
}

interface Props<T extends string> {
  assistiveText?: string;
  disabled?: boolean;
  errorText?: string;
  labelText: string;
  name?: string;
  onChange: (value: T[]) => void;
  options: readonly PillboxOption<T>[];
  value: T[];
}

const Pillbox = <T extends string>({
  assistiveText,
  disabled,
  errorText,
  labelText,
  name,
  onChange,
  options,
  value,
}: Props<T>) => {
  const toggle = (option: T) => {
    // Rebuild from `options` so the selection keeps the option order.
    onChange(
      options
        .map((o) => o.value)
        .filter((v) => (v === option ? !value.includes(v) : value.includes(v))),
    );
  };

  return (
    <fieldset className={styles.container} disabled={disabled}>
      <legend className={clsx(labelStyles.label, styles.legend)}>
        {labelText}
      </legend>

      <div className={styles.pill}>
        {options.map((option) => (
          <label className={styles.option} key={option.value}>
            <input
              aria-label={option.label}
              checked={value.includes(option.value)}
              className={styles.input}
              name={name}
              onChange={() => {
                toggle(option.value);
              }}
              type="checkbox"
            />
            <span className={styles.face}>
              {option.display ?? option.label}
            </span>
          </label>
        ))}
      </div>

      <FieldMessage assistiveText={assistiveText} errorText={errorText} />
    </fieldset>
  );
};

export default Pillbox;
