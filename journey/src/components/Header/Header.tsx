// External
import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import { motion } from 'motion/react';

// Styles
import styles from './Header.module.scss';

const navigationItems = [
  { name: 'Habits', url: '/' },
  { name: 'Journey', url: '/journey' },
  { name: 'Settings', url: '/settings' },
];

interface HeaderProps {
  bottomNavigation: boolean;
}

const Header = ({ bottomNavigation }: HeaderProps) => {
  const location = useLocation();
  const offscreen = { y: bottomNavigation ? '100%' : '-100%' };

  return (
    <motion.header
      animate={{ y: 0 }}
      className={clsx(styles.header, bottomNavigation && styles.bottom)}
      exit={offscreen}
      initial={offscreen}
      transition={{ duration: 0.1 }}
    >
      <ul className={styles.list}>
        {navigationItems.map((item) => {
          const active = location.pathname === item.url;

          return (
            <li className={styles.item} key={item.url}>
              <Link className={styles.link} to={item.url}>
                {item.name}

                {active ? (
                  <motion.div
                    className={styles.underline}
                    layoutId={
                      bottomNavigation ? 'underline-bottom' : 'underline-top'
                    }
                    transition={{ duration: 0.1 }}
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.header>
  );
};

export default Header;
