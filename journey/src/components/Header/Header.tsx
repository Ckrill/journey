import { Link, useLocation } from 'react-router-dom';

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
        {navigationItems.map((item, index) => {
          const active = location.pathname === item.url;

          return (
            <li
              className={`${styles.item} ${
                active ? styles['item--active'] : ''
              }`}
              key={index}
            >
              <Link className={styles.link} to={item.url}>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
};

export default Header;
