// External
import clsx from 'clsx';
import type { ReactNode } from 'react';

// Styles
import styles from './HabitRow.module.scss';

interface Props {
  /** The week's day cells. */
  children: ReactNode;
  className?: string;
  name: ReactNode;
  trailing: ReactNode;
}

const HabitRow = ({ children, className, name, trailing }: Props) => (
  <div className={clsx(styles.row, className)}>
    <div className={styles.header}>
      {name}
      {trailing}
    </div>

    {children}
  </div>
);

export default HabitRow;
