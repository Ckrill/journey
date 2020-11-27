import React, { useEffect, useState } from 'react';

// Helpers
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../helpers/localStorage';

// Components
import Button from '../components/Button/Button';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import Checklist from '../components/Checklist/Checklist';

// Types
import { Exercise, Exercises } from '../types/types';
import {
  ChecklistItemType,
  ChecklistType,
} from '../components/Checklist/ChecklistTypes';

const Workout = () => {
  const [exercises, setExercises] = useState<Exercises>([]);
  const [workouts, setWorkouts] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  const [formState, setFormState] = useState<ChecklistType>([]);

  useEffect(() => {
    if (!firstRender) return;

    const exercises = getFromLocalStorage('exercises') || [];
    const workouts = getFromLocalStorage('workouts') || [];

    setExercises(exercises);
    setFormState(
      exercises.map((item: Exercise) => ({ ...item, checked: false }))
    );
    setWorkouts(workouts);

    setFirstRender(false);
  }, [firstRender]);

  const submit = (event: any) => {
    event.preventDefault();
    const date = new Date();
    const type = 'Workout';

    const finishedExercises: ChecklistType = formState.filter(
      (item) => item.checked
    );

    finishedExercises.forEach((item) => {
      delete item.checked;
    });

    const finishedWorkout = {
      date: date,
      type: type,
      exercises: finishedExercises,
    };

    const newWorkouts: { date: Date; type: string; exercises: Exercises }[] = [
      ...workouts,
      finishedWorkout,
    ];

    saveToLocalStorage('workouts', newWorkouts);

    // Reset form.
    const clearedForm = formState.map((item: ChecklistItemType) => {
      item.checked = false;
      return item;
    });
    setFormState(clearedForm);
  };

  return (
    <>
      {exercises.length === 0 ? (
        <SectionContainer>
          <Section>
            <Heading>Workout</Heading>
            <Paragraph>It is not time for a workout yet.</Paragraph>
          </Section>
        </SectionContainer>
      ) : (
        <SectionContainer>
          <Section>
            <Heading>Today's workout</Heading>
          </Section>

          <form onSubmit={submit} style={{ display: 'contents' }}>
            <Section>
              <Checklist
                items={formState}
                onChange={(exerciseName: string) => {
                  let newState = [...formState];

                  formState.forEach((item, index) => {
                    if (item.name === exerciseName) {
                      newState[index]['checked'] = !formState[index].checked;
                    }
                  });

                  setFormState(newState);
                }}
              />
            </Section>

            <Section>
              <Button
                disabled={!formState.find((item) => item.checked === true)}
              >
                Submit
              </Button>
            </Section>
          </form>
        </SectionContainer>
      )}
    </>
  );
};

export default Workout;
