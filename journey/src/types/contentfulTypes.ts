import { CollectionProp, EntryProps, Link } from 'contentful-management/types';

// Generic

type EntryLink = Link<'Entry'>;

export interface ArrayContentful extends CollectionProp<EntryProps<any>> {}

// User

type UserFields = { name: string };

export type UserContentful = EntryProps<UserFields>;

export interface UsersContentful extends CollectionProp<UserContentful> {}

// Workout

type WorkoutFields = { date: Date; name: string; user: EntryLink };

export interface WorkoutContentful extends EntryProps<WorkoutFields> {}

export interface WorkoutsContentful extends CollectionProp<WorkoutContentful> {
  includes: { Entry: UserContentful[] };
}
