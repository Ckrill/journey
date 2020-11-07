import React from 'react';

// Components
import Section from '../Section/Section';

// Styling
import styles from './Form.module.css'; // Import css modules stylesheet as styles

// type Props = {
//   name: string;
//   type: string;
//   value: string | number;
//   labelText: string;
//   changeHandler: any;
// };

const FormInput = React.forwardRef(({ labelText, ...props }: any, ref: any) => (
  <Section>
    <input
      className={styles.input}
      // id={props.id}
      // type={props.type}
      // min={props.min}
      // max={props.max}
      // name={props.name}
      // value={props.value}
      placeholder=" "
      // disabled={props.disabled}
      // autoFocus={props.autoFocus}
      // onChange={props.changeHandler ? props.changeHandler : undefined}
      {...props}
      ref={ref}
    />
    {labelText && (
      <label className={styles.label} htmlFor={props.name}>
        <span className={styles.labelText}>{labelText}</span>
        <span className={styles.labelLine} />
      </label>
    )}
  </Section>
));

export default FormInput;
