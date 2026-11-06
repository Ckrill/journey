// Types
import type { ReactNode, Ref } from 'react';

// Styles
import styles from './Notice.module.scss';

interface Props {
  children: ReactNode;
  icon: ReactNode;
  ref?: Ref<HTMLDivElement>;
  role?: 'alert' | 'status';
  tone: 'error' | 'success' | 'warning';
}

const Notice = ({ children, icon, ref, role, tone }: Props) => (
  <div className={styles.notice} data-tone={tone} ref={ref} role={role}>
    <span aria-hidden="true" className={styles.icon}>
      {icon}
    </span>

    <p className={styles.text}>{children}</p>
  </div>
);

export default Notice;
