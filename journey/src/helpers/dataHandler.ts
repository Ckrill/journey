// types
import { ArrayContentful, EventsContentful } from '../types/contentfulTypes';
import { Events } from '../types/types';

// export const primeObject = (obj) => obj.fields;

// export const primeArray = (arr) => arr.items.map((item) => item.fields);

export const primeArrayToObject = (arr: ArrayContentful) => {
  if (!arr.items[0]) return;

  // Trim unneccesary info from event object.
  const fields = arr.items[0].fields;
  // Add id to event object.
  fields.id = arr.items[0].sys.id;

  return fields;
};

export const primeEvents = (eventsContentful: EventsContentful) => {
  const eventsCrude: any = eventsContentful.items.map((eventCrude) => {
    // Trim unneccesary info from eventCrude object.
    const event: any = eventCrude.fields;
    // Add id to eventCrude object.
    event.id = eventCrude.sys.id;

    return event;
  });

  // Map the poster image to the video based on image id.
  eventsCrude.forEach((event: any) => {
    const userId = event.user && event.user.sys.id;
    const user = eventsContentful.includes.Entry.find((entry) => {
      return entry.sys.id === userId;
    });
    event.user = { ...user?.fields, id: userId };
  });

  const events: Events = eventsCrude;

  return events;
};
