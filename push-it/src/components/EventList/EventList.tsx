import React from 'react';

// Helpers
import { sortNewestFirst } from '../../helpers/sorting';
import { getMonth } from '../../helpers/dateFormatting';

// Components
import Event from './Event';
import Divider from '../Divider/Divider';

// Styling
import styles from './EventList.module.scss';

// Types
import { Workout, Workouts } from '../../types/types';

type Props = {
  events: Workouts;
};

const EventList = ({ events }: Props) => {
  let eventsByMonth: Workouts[] = [];

  events.filter((event: Workout) => {
    const eventMonth: any = getMonth(new Date(event.date));

    // If the array does not exist, create it
    !eventsByMonth[eventMonth] && (eventsByMonth[eventMonth] = []);

    // Add event to eventsByMonth
    eventsByMonth[eventMonth].push(event);
    return eventsByMonth;
  });

  return (
    <div className={styles['event-list']}>
      {Object.keys(eventsByMonth).map((month: any, i: number) => {
        return (
          <React.Fragment key={i}>
            <Divider text={month} data-appearance="faint" />
            {sortNewestFirst(eventsByMonth[month], 'date').map(
              (event: Workout, key: number) => (
                <Event event={event} key={key} />
              )
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default EventList;
