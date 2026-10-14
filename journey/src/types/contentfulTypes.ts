// Types
import type {
  CollectionProp,
  EntryProps,
  Link,
} from 'contentful-management/types';

import type { Weekday } from './types';

// Generic

type EntryLink = Link<'Entry'>;

export interface ArrayContentful extends CollectionProp<EntryProps<unknown>> {
  includes?: { Entry: EntryProps<unknown>[] };
}

// User

interface UserFields {
  name: string;
}

export type UserContentful = EntryProps<UserFields>;

export type UsersContentful = CollectionProp<UserContentful>;

// Habit

interface HabitFields {
  active: boolean;
  name: string;
  plannedDays: Weekday[];
  user: EntryLink;
  weeklyTarget: number;
}

type HabitContentful = EntryProps<HabitFields>;

export interface HabitsContentful extends CollectionProp<HabitContentful> {
  includes?: { Entry: EntryProps<UserFields>[] };
}

// Event

interface EventFields {
  date: string;
  habit: EntryLink;
  name: string;
}

type EventContentful = EntryProps<EventFields>;

export interface EventsContentful extends CollectionProp<EventContentful> {
  includes?: { Entry: EntryProps<HabitFields>[] };
}
