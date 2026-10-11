// External
import React from 'react';

// Styles
import styles from './Code.module.scss';

interface Props {
  children: React.ReactNode;
}

const Code = ({ children }: Props) => (
  <code className={styles.code}>{children}</code>
);

export default Code;
