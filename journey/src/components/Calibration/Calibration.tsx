import React from 'react';
import { useForm } from 'react-hook-form';

// Helpers
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../../helpers/localStorage';

// Components
import Heading from '../Heading/Heading';
import Form from '../Form/Form';
import Button from '../Button/Button';
import FormInput from '../Form/FormInput';

// Styling
// import styles from './Calibration.module.scss';

// const evaluation = () => {};

const TestResults = () => {
  return (
    <div>
      <span>Test results!</span>
      <span>Sammenligning med sidste test</span>
    </div>
  );
};

const Calibration = (props: any) => {
  const { handleSubmit } = useForm();

  const onSubmit = (exercises: any) => {
    // TODO: This should probably not be taken from Local Storage,
    // TODO: if the app has already loaded this, it should come from state. Right?
    let tests = getFromLocalStorage('tests') || [];
    const date = new Date();
    const type = 'Test';

    const newObj = { type, date, ...exercises };

    tests.push(newObj);

    saveToLocalStorage('tests', tests);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Heading>It's time for a test!</Heading>

        {props.exercises.map((element: string, key: number) => (
          <React.Fragment key={key}>
            <FormInput
              name={`exercises[${element}]`}
              type="text"
              labelText={`How many ${props.exercises[key]} can you do?`}
            />
          </React.Fragment>
        ))}
        <Button type="submit">Save</Button>
        <Button type="button" data-priority="secondary">
          Skip test
        </Button>
      </Form>

      <TestResults />
    </>
  );
};

export default Calibration;
