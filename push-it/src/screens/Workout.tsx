import React, { useEffect, useState } from 'react';

// Data
import trainingPlan from '../data/training-plan.json';

// Helpers
import { getFromLocalStorage } from '../helpers/localStorage';

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

const Workout = () => {
  const [exercises, setExercises] = useState([]);
  const [showSlideIn, setShowSlideIn] = useState(false);
  const [tests, setTests] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

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
    setTests(workouts);
    setWorkouts(tests);

    setFirstRender(false);
  }, [firstRender]);

  return (
    <>
      {exercises.length === 0 && (
        <SectionContainer>
          <Section>
            <Heading>Workout</Heading>
            <Paragraph>It is not time for a workout yet.</Paragraph>
          </Section>
        </SectionContainer>
      )}

      <SectionContainer>
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
      </SlideIn>
    </>
  );
};

export default Workout;
