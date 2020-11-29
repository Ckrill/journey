// export const primeObject = (obj) => obj.fields;

// export const primeArray = (arr) => arr.items.map((item) => item.fields);

export const primeWorkouts = (workoutsCrude) => {
  const workouts = workoutsCrude.items.map((workout) => {
    // Trim unneccesary info from workout object.
    const fields = workout.fields;
    // Add id to workout object.
    fields.id = workout.sys.id;
    return fields;
  });

  // Map the poster image to the video based on image id.
  workouts.forEach((workout) => {
    const userId = workout.user && workout.user.sys.id;
    const user =
      workoutsCrude.includes.Entry.find((entry) => {
        return entry.sys.id === userId;
      }) || {};
    workout.user = { ...user.fields };
  });

  return workouts;
};
