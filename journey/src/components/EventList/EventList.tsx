import React from 'react';

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
  user: User | null;
};

const EventList = ({ events, user }: Props) => {
  const eventsByYear: Year[] = categorizeByYearAndMonth(events) || [];
  const currentYear = new Date().getFullYear();

  // TODO: Is this a custom hook instead of a helper?
  // TODO: Add workouts as a state.
  // TODO: Use useMemo to set the state.

  return (
    <div className={styles['event-list']}>
      {eventsByYear.map((year) => (
        <React.Fragment key={year.year}>
          {Number(year.year) !== currentYear && (
            <Divider text={String(year.year)} data-appearance="faint" />
          )}

          {year.months.map((month: Month, i: number) => (
            <React.Fragment key={month.month}>
              <Divider text={month.month} data-appearance="faint" />

              {month.workouts.map((event: Workout, i: number) => (
                <Event event={event} key={i} user={user} />
              ))}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EventList;
