import React, { useEffect, useState } from 'react';

// Data
import trainingPlan from '../data/training-plan.json';

// Helpers
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../helpers/localStorage';

// Components
import Button from '../components/Button/Button';
import Form from '../components/Form/Form';
import FormInput from '../components/Form/FormInput';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import SlideIn from '../components/SlideIn/SlideIn';
import WorkoutList from '../components/WorkoutList/WorkoutList';
import Checklist from '../components/Checklist/Checklist';

// Types
import { Exercise, Exercises } from '../types/types';
import {
  ChecklistItemType,
  ChecklistType,
} from '../components/Checklist/ChecklistTypes';

const Workout = () => {
  const [exercises, setExercises] = useState<Exercises>([]);
  const [showSlideIn, setShowSlideIn] = useState(false);
  const [tests, setTests] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  const [formState, setFormState] = useState<ChecklistType>([]);

  const handleClick = (exercise: string) => {
    console.log('exercise: ', exercise);
    console.log('this: ', this);

    setShowSlideIn(true);
  };

  useEffect(() => {
    if (!firstRender) return;

    const exercises = getFromLocalStorage('exercises') || [];
    const workouts = getFromLocalStorage('workouts') || [];
    const tests = getFromLocalStorage('tests') || [];

    setExercises(exercises);
    setFormState(
      exercises.map((item: Exercise) => ({ ...item, checked: false }))
    );
    setTests(tests);
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

      {/* <SectionContainer>
        <Section>
          <Heading>Today's workout</Heading>
          {exercises.length && workouts.length && (
            <WorkoutList
              exercises={exercises}
              tests={tests}
              trainingPlan={trainingPlan}
              workouts={workouts}
              handleClick={handleClick}
            />
          )}
        </Section>
      </SectionContainer>
      <SlideIn isShown={showSlideIn}>
        <Form>
          <FormInput
            labelText={`I did this many reps!`}
            name={`reps`}
            // ref={register}
            type="text"
          />
          <FormInput
            labelText={`With this many kilos extra!`}
            name={`weight`}
            // ref={register}
            type="text"
          />
          <Section>
            <Button>Submit</Button>
          </Section>
        </Form>
      </SlideIn> */}
    </>
  );
};

export default Workout;
