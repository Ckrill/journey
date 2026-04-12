// Helpers
import { getMonth } from '../../helpers/dateFormatting';

// Components
import Divider from '../Divider/Divider';

// Styles
import styles from './EventList.module.scss';

const presentMonth = getMonth(new Date());

const MockEventList = () => {
  return (
    <div className={styles['event-list']}>
      <Divider text={presentMonth} data-appearance="faint" />

      <div>Getting your events...</div>
    </div>
  );
};

export default MockEventList;
