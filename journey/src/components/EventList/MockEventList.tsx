// Utilities
import { formatDate } from '../../helpers/dateFormatting';

// Miscellaneous
import Divider from '../Divider/Divider';

// Styles
import styles from './EventList.module.scss';

const presentMonth = formatDate(new Date(), 'month');

const MockEventList = () => {
  return (
    <div className={styles['event-list']}>
      <Divider data-appearance="faint" text={presentMonth} />

      <div>Getting your events...</div>
    </div>
  );
};

export default MockEventList;
