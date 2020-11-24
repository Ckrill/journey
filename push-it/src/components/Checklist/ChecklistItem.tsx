import React from 'react';

// Images
import Checkmark from '../../assets/icons/check.svg';

// Styles
import styles from './ChecklistItem.module.scss';

const ChecklistItem = ({
  checked = false,
  setChecked,
}: {
  checked?: boolean;
  setChecked: Function;
}) => (
  <label
    className={`${styles.checkbox} ${
      checked ? styles['checkbox--checked'] : ''
    }`}
  >
    <div className={styles.background}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />

      <img alt="Checkmark" className={styles.checkmark} src={Checkmark} />
    </div>
  </label>
);

export default ChecklistItem;
