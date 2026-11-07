// External
import type { InputHTMLAttributes } from 'react';
import { BsCheck } from 'react-icons/bs';

// Styles
import styles from './Checkbox.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

const Checkbox = ({ id, label, ...props }: Props) => (
  <label className={styles.container}>
    <input {...props} className={styles.input} id={id} type="checkbox" />
    <span className={styles.box}>
      <BsCheck aria-hidden className={styles.icon} />
    </span>
    <span className={styles.label}>{label}</span>
  </label>
);

export default Checkbox;
