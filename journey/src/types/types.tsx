export type User = {
  id: string;
  name: string;
};

export type Settings = {
  birthYear?: number;
  sound: boolean;
  vibration: boolean;
};

export type Habit = {
  active: boolean;
  createdAt: string;
  id: string;
  name: string;
  weeklyTarget: number;
};

export type Habits = Habit[];

export type Event = {
  date: string; // ISO calendar date (YYYY-MM-DD)
  habitId: string;
  id: string;
};

export type Events = Event[];
