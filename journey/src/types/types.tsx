import type { Enums } from './database.types';

export interface Settings {
  birthYear?: number;
  sound: boolean;
  vibration: boolean;
}

export type Weekday = Enums<'weekday'>;

export interface Habit {
  active: boolean;
  createdAt: string;
  goalDescription: string;
  goalMonths: null | number;
  id: string;
  name: string;
  plannedDays: Weekday[];
  weeklyTarget: number;
}

export type Habits = Habit[];

export interface Event {
  date: string; // ISO calendar date (YYYY-MM-DD)
  habitId: string;
  id: string;
}

export type Events = Event[];

export interface Reflection {
  blockers: string;
  nextSteps: string;
  plan: string;
  wentWell: string;
}
