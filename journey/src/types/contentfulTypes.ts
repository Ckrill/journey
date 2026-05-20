import type {
  CollectionProp,
  EntryProps,
  Link,
} from 'contentful-management/types';

// Generic

type EntryLink = Link<'Entry'>;

export interface ArrayContentful extends CollectionProp<EntryProps<any>> {
  includes?: { Entry: EntryProps<any>[] };
}

// User

type UserFields = { name: string; bestStreak?: number };

export type UserContentful = EntryProps<UserFields>;

export type UsersContentful = CollectionProp<UserContentful>;

// Event

type EventFields = { date: Date; name: string; user: EntryLink };

type EventContentful = EntryProps<EventFields>;

export interface EventsContentful extends CollectionProp<EventContentful> {
  includes?: { Entry: EntryProps<UserFields>[] };
}
