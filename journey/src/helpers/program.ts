export const getProgram = (
  trainingPlan: any,
  previousProgram?: any,
  test?: number
  ) => {
    let program;

  if (previousProgram) {
    program =
      trainingPlan.weeks[previousProgram.week].difficulties[
        previousProgram.difficulty
      ].days[previousProgram.day + 1] ||
      trainingPlan.weeks[previousProgram.week + 1].difficulties[
        previousProgram.difficulty
      ].days[0];
  } else if (test) {
    program = trainingPlan.weeks[0].difficulties.find((item: any) => {
      if (item.min <= test && item.max >= test) return item.days[0];
      return null;
    });
  } else {
    program = trainingPlan.weeks[0].difficulties[0].days[0]
    console.log('program: ', program);
  }

  return program;
};
