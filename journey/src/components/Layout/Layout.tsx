import type { ReactNode } from 'react';

import styles from './Layout.module.scss';

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className={styles.layout}>{children}</div>;
};

export default Layout;
