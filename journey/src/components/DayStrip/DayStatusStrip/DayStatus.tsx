// External
import clsx from 'clsx';

// Styles
import shared from '../DayStrip.module.scss';
import styles from './DayStatus.module.scss';

interface Props {
  done: boolean;
  /** Full weekday name; its first letter is shown on the cell. */
  label: string;
}

const DayStatus = ({ done, label }: Props) => (
  <li className={clsx(shared.day, styles.day)} data-done={done}>
    <span aria-hidden>{label[0]}</span>

    <span className={styles.screenReaderOnly}>
      {label}: {done ? 'done' : 'not done'}
    </span>
  </li>
);

export default DayStatus;
