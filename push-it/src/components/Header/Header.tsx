import React from 'react';
import { Link } from 'react-router-dom';

// Styling
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link className={styles.link} to={'/'}>
            Home
          </Link>
        </li>
        <li className={styles.item}>
          <Link className={styles.link} to={'/workout'}>
            Workout
          </Link>
        </li>
        <li className={styles.item}>
          <Link className={styles.link} to={'/progress'}>
            Journey
          </Link>
        </li>
        <li className={styles.item}>
          <Link className={styles.link} to={'/settings'}>
            Settings
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
