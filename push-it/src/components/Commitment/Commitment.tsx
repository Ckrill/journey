import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Helpers
import { saveToLocalStorage } from '../../helpers/localStorage';

// Data
// import inspiration from '../../data/inspiration.json';

// Components
import Heading from '../Heading/Heading';
import Form from '../Form/Form';
import Button from '../Button/Button';
import FormInput from '../Form/FormInput';
import Section from '../Section/Section';

// Styling
// import styles from './Commitment.module.scss';

const Commitment = (props: any) => {
  const { register, handleSubmit } = useForm();
  const [exerciseList, hadleChange] = useState(['']);

  const onSubmit = (data: any) => {
    // Remove empty strings from array
    const exercises = data.exercises.filter(function (exercise: string) {
      return exercise !== '';
    });

    // Transform all exercises to lowercase
    // TODO: Highly inelegant
    exercises.forEach((element: any, key: number) => {
      exercises[key] = exercises[key].toLowerCase();
    });

    saveToLocalStorage('exercises', exercises);
    props.handleUpdateExercises(exercises);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading>What exercises do you wish to do?</Heading>

      {exerciseList.map((element: string, key: number) => (
        <React.Fragment key={key}>
          <FormInput
            ref={register}
            id={`exercises[${key}]`}
            type="text"
            name={`exercises[${key}]`}
            // placeholder={element}
            key={key}
            labelText="Exercise"
            value={element}
            onChange={(event: any) => {
              const value = event.target.value;
              exerciseList[key] = value;
              hadleChange([...exerciseList]);
            }}
          />
        </React.Fragment>
      ))}
      <Section>
        <button
          onClick={() => {
            hadleChange([...exerciseList, '']);
          }}
          type="button"
        >
          Add exercise
        </button>
        <button
          disabled={exerciseList.length <= 1 && true}
          onClick={() => {
            exerciseList.pop();
            hadleChange([...exerciseList]);
          }}
          type="button"
        >
          Remove exercise
        </button>
      </Section>
      <Section>
        <Button type="submit">Save</Button>
      </Section>
    </Form>
  );
};

export default Commitment;
