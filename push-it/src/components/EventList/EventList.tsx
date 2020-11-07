import React from 'react';

// Helpers
import { sortNewestFirst } from '../../helpers/sorting';
import { getMonth } from '../../helpers/dateFormatting';

// Components
import Event from './Event';
import Divider from '../Divider/Divider';

// Styling
import styles from './EventList.module.css';

// type Event = {
//   date: string;
//   type: string;
//   exercises: [{ name: string; reps: any }];
// };
// type Events = Event[];

type Props = {
  events: any;
};

const EventList = (props: Props) => {
  const { events } = props;

  let eventsByMonth: any[] = [];

  events.filter((event: any) => {
    const eventMonth: any = getMonth(new Date(event.date));

    // If the array does not exist, create it
    !eventsByMonth[eventMonth] && (eventsByMonth[eventMonth] = []);

    // Add event to eventsByMonth
    eventsByMonth[eventMonth].push(event);
    return eventsByMonth;
  });

  return (
    <div className={styles['event-list']}>
      {Object.keys(eventsByMonth)
        .reverse()
        .map((month: any, i: number) => {
          return (
            <React.Fragment key={i}>
              <Divider text={month} data-appearance="faint" />
              {sortNewestFirst(eventsByMonth[month], 'date').map(
                (event: any, key: number) => (
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
