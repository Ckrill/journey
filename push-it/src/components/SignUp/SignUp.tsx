import React from 'react';
import { useForm } from 'react-hook-form';

// Components
import Form from '../Form/Form';
import FormInput from '../Form/FormInput';
import Section from '../Section/Section';
import Button from '../Button/Button';
import Paragraph from '../Paragraph/Paragraph';

// Helpers
import {
  getFromLocalStorage,
  saveToLocalStorage
} from '../../helpers/localStorage';

const SignUp = (props: any) => {
  const { register, handleSubmit } = useForm();

  const user = getFromLocalStorage('user') || {};

  const onSubmit = (data: any) => {
    user.name = data.name;
    saveToLocalStorage('user', user);
    props.handleUpdateUser(user);
  };

  const onSkip = (data: any) => {
    user.name = 'Skip';
    saveToLocalStorage('user', user);
    props.handleUpdateUser(user);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        ref={register}
        name="name"
        type="text"
        labelText="What would you like to be called?"
      />

      <Section>
        <Button type="submit">Save</Button>
        <Button onClick={onSkip} type="button" data-priority="secondary">
          Skip
        </Button>
      </Section>
      <Section>
        <Paragraph>Alright, "name", lets get started!</Paragraph>
      </Section>
    </Form>
  );
};

export default SignUp;
