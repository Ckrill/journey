import { Fragment } from 'react';

// Helpers
import {
  categorizeByYearAndMonth,
  Month,
  Year,
} from '../../helpers/categorizer';

// Components
import Event from './Event';
import Divider from '../Divider/Divider';

// Styling
import styles from './EventList.module.scss';

// Types
import { User, Workout, Workouts } from '../../types/types';

type Props = {
  events: Workouts;
  deleteEvent: (id: string) => void;
  user: User | null;
};

const EventList = ({ events, deleteEvent, user }: Props) => {
  const eventsByYear: Year[] = categorizeByYearAndMonth(events) || [];
  const currentYear = new Date().getFullYear();

  // TODO: Is this a custom hook instead of a helper?
  // TODO: Add workouts as a state.
  // TODO: Use useMemo to set the state.

  return (
    <div className={styles['event-list']}>
      {eventsByYear.map((year) => (
        <Fragment key={year.year}>
          {Number(year.year) !== currentYear && (
            <Divider text={String(year.year)} data-appearance="faint" />
          )}

          {year.months.map((month: Month) => (
            <Fragment key={month.month}>
              <Divider text={month.month} data-appearance="faint" />

              {month.workouts.map((event: Workout) => (
                <Event
                  event={event}
                  key={event.id}
                  deleteEvent={deleteEvent}
                  user={user}
                />
              ))}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default EventList;
