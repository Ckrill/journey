// Styles
import styles from './Checkbox.module.scss';

type Props = {
  callback: () => void;
  checked: boolean;
  id: string;
  label: string;
};

const Checkbox = ({ callback, checked, id, label }: Props) => (
  <div className={styles.container}>
    <input
      checked={checked}
      className={styles.inputCheckbox}
      id={id}
      type="checkbox"
      onChange={callback}
    />{' '}
    <label className={styles.checkbox} htmlFor={id}>
      <span>
        <svg width="22px" height="20px" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span>
      <span>{label}</span>
    </label>
  </div>
);

export default Checkbox;
