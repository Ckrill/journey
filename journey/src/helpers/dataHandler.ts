// types
import type {
  EventsContentful,
  HabitsContentful,
  UsersContentful,
} from '../types/contentfulTypes';
import type { Event, Events, Habit, Habits, User } from '../types/types';

export const parseUser = (arr: UsersContentful): null | User => {
  const item = arr.items[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!item) return null;

  const user: User = {
    id: item.sys.id,
    name: item.fields.name,
  };

  return user;
};

export const parseHabits = (habitsContentful: HabitsContentful): Habits => {
  const habits: Habits = habitsContentful.items.map((item) => {
    const habit: Habit = {
      active: item.fields.active,
      createdAt: item.sys.createdAt,
      id: item.sys.id,
      name: item.fields.name,
      weeklyTarget: item.fields.weeklyTarget,
    };

    return habit;
  });

  return habits;
};

export const parseEvents = (eventsContentful: EventsContentful): Events => {
  const events: Events = eventsContentful.items.map((item) => {
    const event: Event = {
      date: item.fields.date,
      habitId: item.fields.habit.sys.id,
      id: item.sys.id,
    };

    return event;
  });

  return events;
};
