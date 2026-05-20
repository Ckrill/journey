// types
import type {
  EventsContentful,
  UsersContentful,
} from '../types/contentfulTypes';
import type { Event, Events, User } from '../types/types';

export const parseUser = (arr: UsersContentful): User | null => {
  const item = arr.items[0];
  if (!item) return null;

  const user: User = {
    id: item.sys.id,
    name: item.fields.name,
    bestStreak: item.fields.bestStreak,
  };

  return user;
};

export const parseEvents = (eventsContentful: EventsContentful): Events => {
  const events: Events = eventsContentful.items.map((eventCrude) => {
    const userId = eventCrude.fields.user.sys.id;
    const userEntry = eventsContentful.includes?.Entry.find(
      (entry) => entry.sys.id === userId,
    );

    const event: Event = {
      date: String(eventCrude.fields.date),
      id: eventCrude.sys.id,
      name: eventCrude.fields.name,
      user: {
        id: userId,
        name: userEntry?.fields.name ?? '',
      },
    };

    return event;
  });

  return events;
};
