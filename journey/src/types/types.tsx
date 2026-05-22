export type User = {
  id: string;
  name: string;
  bestStreak?: number;
  currentStreak?: number;
  streakUpdatedDate?: string;
};

export type Settings = {
  sound: boolean;
  vibration: boolean;
};

export type Event = {
  date: string;
  id: string;
  name: string;
  user: User;
};

export type Events = Event[];
