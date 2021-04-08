import React from 'react';

// Helpers
import { getMonth } from '../../helpers/dateFormatting';

// Components
import Divider from '../Divider/Divider';

// Styles
import styles from './EventList.module.scss';

const MockEventList = () => {
  const presentMonth = getMonth(new Date());

  return (
    <div className={styles['event-list']}>
      <Divider text={presentMonth} data-appearance="faint" />
      <div>Getting your workouts...</div>
    </div>
  );
};

export default MockEventList;
