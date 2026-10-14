export interface User {
  id: string;
  name: string;
}

export interface Settings {
  birthYear?: number;
  sound: boolean;
  vibration: boolean;
}

export type Weekday = 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';

export interface Habit {
  active: boolean;
  createdAt: string;
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
