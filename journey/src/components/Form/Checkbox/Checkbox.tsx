// External
import clsx from 'clsx';
import { useState } from 'react';
import { BsCheck } from 'react-icons/bs';

// Styles
import styles from './Checkbox.module.scss';

interface Props {
  callback: () => void;
  checked: boolean;
  id: string;
  label: string;
}

const Checkbox = ({ callback, checked, id, label }: Props) => {
  // Only set after a click, so boxes that start checked don't pulse on load.
  const [pulsing, setPulsing] = useState(false);

  return (
    <label className={styles.container}>
      <input
        checked={checked}
        className={styles.input}
        id={id}
        onChange={(e) => {
          setPulsing(e.target.checked);
          callback();
        }}
        type="checkbox"
      />
      <span
        className={clsx(styles.box, pulsing && styles.pulse)}
        onAnimationEnd={() => {
          setPulsing(false);
        }}
      >
        <BsCheck aria-hidden className={styles.icon} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export default Checkbox;
