export type User = {
  id: string;
  name: string;
  // slug: string;
};

// export type Exercise = {
//   name: string;
// };

// export type Exercises = Exercise[];

// export type Test = {
//   name: string;
//   reps: number;
// };

// export type Tests = {
//   type: string;
//   date: string;
//   exercises: Test[];
// }[];

export type Workout = {
  date: string;
  // exercises?: Exercises;
  id: string;
  name: string;
  user: User;
};

export type Workouts = Workout[];

// export type Event = {
//   date: Date;
//   // exercises?: Exercises;
//   id?: string;
//   message?: string;
//   name?: string;
//   type?: string;
//   user?: User;
// };

// export type Events = Events[];
