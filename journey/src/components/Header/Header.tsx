import { Link, useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';

// Styling
import styles from './Header.module.scss';

const navigationItems = [
  { name: 'Journey', url: '/journey' },
  { name: 'Add Event', url: '/' },
  { name: 'Settings', url: '/settings' },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
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
                    layoutId="underline"
                    transition={{ duration: 0.1 }}
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
};

export default Header;
