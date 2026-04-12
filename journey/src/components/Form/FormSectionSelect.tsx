// Components
import Section from '../Section/Section';

// Styling
import styles from './Form.module.scss'; // Import css modules stylesheet as styles

interface FormSectionSelectProps {
  disabled?: boolean;
  name?: string;
  value?: string;
  labelText?: string;
  changeHandler?(...args: unknown[]): unknown;
  optionHidden?: string;
  options?: unknown[];
}

/**
 * @deprecated
 * @param props
 * @returns
 */

const FormSectionSelect = (props: FormSectionSelectProps) => (
  <Section>
    <select
      className={styles.select}
      id={props.name}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      onChange={props.changeHandler ? props.changeHandler : undefined}
    >
      {props.optionHidden && <option hidden>{props.optionHidden}</option>}
      {props.options?.map((option: any) => (
        <option value={option.value} key={option.value}>
          {option.name}
        </option>
      ))}
    </select>
    {props.labelText && (
      <label className={styles.label} htmlFor={props.name}>
        <span className={styles.labelText}>{props.labelText}</span>
        <span className={styles.labelLine} />
      </label>
    )}
  </Section>
);

export default FormSectionSelect;
