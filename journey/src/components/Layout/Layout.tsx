import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './Layout.module.scss';

interface LayoutProps {
  bottomNavigation?: boolean;
  children: ReactNode;
}

const Layout = ({ bottomNavigation, children }: LayoutProps) => {
  return (
    <div
      className={clsx(
        styles.layout,
        bottomNavigation && styles.bottomNavigation,
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
