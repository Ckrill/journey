// types
import { ArrayContentful, WorkoutsContentful } from '../types/contentfulTypes';
import { Workouts } from '../types/types';

// export const primeObject = (obj) => obj.fields;

// export const primeArray = (arr) => arr.items.map((item) => item.fields);

export const primeArrayToObject = (arr: ArrayContentful) => {
  if (!arr.items[0]) return;

  // Trim unneccesary info from workout object.
  const fields = arr.items[0].fields;
  // Add id to workout object.
  fields.id = arr.items[0].sys.id;

  return fields;
};

export const primeWorkouts = (workoutsContentful: WorkoutsContentful) => {
  const workoutsCrude: any = workoutsContentful.items.map((workoutCrude) => {
    // Trim unneccesary info from workoutCrude object.
    const workout: any = workoutCrude.fields;
    // Add id to workoutCrude object.
    workout.id = workoutCrude.sys.id;

    return workout;
  });

  // Map the poster image to the video based on image id.
  workoutsCrude.forEach((workout: any) => {
    const userId = workout.user && workout.user.sys.id;
    const user = workoutsContentful.includes.Entry.find((entry) => {
      return entry.sys.id === userId;
    });
    workout.user = { ...user?.fields, id: userId };
  });

  const workouts: Workouts = workoutsCrude;

  return workouts;
};
