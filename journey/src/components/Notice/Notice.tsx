// External
import React from 'react';

// Styles
import styles from './Notice.module.scss';

interface Props {
  children: React.ReactNode;
  icon: React.ReactNode;
  role?: 'alert';
  tone: 'error' | 'warning';
}

const Notice = ({ children, icon, role, tone }: Props) => (
  <div className={styles.notice} data-tone={tone} role={role}>
    <span aria-hidden="true" className={styles.icon}>
      {icon}
    </span>

    <p className={styles.text}>{children}</p>
  </div>
);

export default Notice;
