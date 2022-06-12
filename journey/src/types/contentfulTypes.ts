import { CollectionProp, EntryProps, Link } from 'contentful-management/types';

// Generic

type EntryLink = Link<'Entry'>;

export interface ArrayContentful extends CollectionProp<EntryProps<any>> {}

// User

type UserFields = { name: string };

export type UserContentful = EntryProps<UserFields>;

export interface UsersContentful extends CollectionProp<UserContentful> {}

// Event

type EventFields = { date: Date; name: string; user: EntryLink };

export interface EventContentful extends EntryProps<EventFields> {}

export interface EventsContentful extends CollectionProp<EventContentful> {
  includes: { Entry: UserContentful[] };
}
