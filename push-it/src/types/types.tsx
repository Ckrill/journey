export type User = { name: string };

export type Exercise = { name: string };
export type Exercises = Exercise[];

export type Test = {
  name: string;
  reps: number;
};
export type Tests = {
  type: string;
  date: string;
  exercises: Test[];
}[];
