import React, { useState } from 'react';
import * as contentful from 'contentful-management';
import { Controller, useForm } from 'react-hook-form';

// Settings
import { settings } from '../../settings/settings';

// Helpers
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../../helpers/localStorage';
import { get, getItemsByAttribute } from '../../helpers/requests';

// Components
import Button from '../Button/Button';
import Form from '../Form/Form';
import FormInput from '../Form/FormInput';
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';
import Section from '../Section/Section';
import { primeArrayToObject } from '../../helpers/dataHandler';

// Types
import { User } from '../../types/types';
import { UsersContentful } from '../../types/contentfulTypes';

const client = contentful.createClient({
  accessToken:
    process.env.REACT_APP_CONTENTFUL_USER ||
    settings.accessTokenManagement ||
    '',
});

const getContentfulUser = (userName: string) =>
  get(getItemsByAttribute('user', 'fields.name', userName));

type Props = {
  setUser: (user: User) => void;
};

const SignUp = ({ setUser }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm();

  const user: User = getFromLocalStorage('user') || {};

  const onSubmit = (data: User) => {
    setSubmitting(true);

    user.name = data.name;

    // If user exists, log in.
    getContentfulUser(data.name).then((response: UsersContentful) => {
      const user: User = primeArrayToObject(response);

      if (user) {
        console.log('LOGIN');
        // Save the user to local storage.
        saveToLocalStorage('user', user);

        // Log in
        setUser(user);
        return;
      } else {
        console.log('CREATE USER');
        // Else Sign up.
        // Create and publish user.
        client
          .getSpace(settings.space)
          .then((space) => space.getEnvironment(settings.environment))
          .then((environment) =>
            environment.createEntry('user', {
              fields: {
                name: {
                  'en-US': data.name,
                },
              },
            })
          )
          .then((entry) => entry.publish())
          .then((entry) => {
            const user: User = {
              id: entry.sys.id,
              name: entry.fields.name['en-US'],
            };

            // Save the new user to local storage.
            saveToLocalStorage('user', user);
            // Let parent component know about the new user.
            console.log('SET USER', user);
            setUser(user);
            // Reset submitError.
            setSubmitError(null);
          })
          .catch((error) => {
            console.error(error);
            setSubmitError(JSON.stringify(error));
          })
          .finally(() => setSubmitting(false));
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        defaultValue=""
        name="name"
        render={({ field }) => (
          <FormInput labelText="Name" type="text" {...field} />
        )}
        rules={{ required: true }}
      />

      <Button disabled={submitting} type="submit">
        Sign in
      </Button>

      {submitError && (
        <Section>
          <Heading>A terrible error happened!</Heading>
          <Paragraph>
            Let me know what you did and what it says below and I will fix it.
          </Paragraph>
          <code>{submitError}</code>
        </Section>
      )}
    </Form>
  );
};

export default SignUp;
