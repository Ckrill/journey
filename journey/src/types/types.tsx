import type { Enums } from './database.types';

export type Sex = 'female' | 'male';

export interface Settings {
  birthYear?: number;
  bottomNavigation: boolean;
  notifications: boolean;
  region?: string;
  sex?: Sex;
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

export interface RetroReminder {
  time: string; // HH:MM, in `timeZone`
  timeZone: string; // IANA zone, e.g. Europe/Copenhagen
  weekday: Weekday;
}
