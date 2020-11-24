import React from 'react';
import PropTypes from 'prop-types';

// Components
import Section from '../Section/Section';

// Styling
import styles from './Form.module.scss'; // Import css modules stylesheet as styles

const FormSectionSelect = (props: any) => (
  <Section>
    <select
      className={styles.select}
      id={props.name}
      name={props.name}
      value={props.value}
      placeholder=" "
      disabled={props.disabled}
      onChange={props.changeHandler ? props.changeHandler : undefined}
    >
      {props.optionHidden && <option hidden>{props.optionHidden}</option>}
      {props.options.map((option: any, i: number) => (
        <option value={option.value} key={i}>
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

FormSectionSelect.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  labelText: PropTypes.string,
  changeHandler: PropTypes.func,
  optionHidden: PropTypes.string,
  options: PropTypes.array,
};

export default FormSectionSelect;
