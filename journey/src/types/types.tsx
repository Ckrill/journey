export type User = {
  bestStreak?: number;
  currentStreak?: number;
  id: string;
  name: string;
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
