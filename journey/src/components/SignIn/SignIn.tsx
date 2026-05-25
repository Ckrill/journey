// External
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Utilities
import { saveToLocalStorage } from '../../helpers/localStorage';

// API
import { createUser, fetchUser } from '../../api/user';

// Contexts
import { useUserUpdate } from '../../contexts/userContext';

// Miscellaneous
import Button from '../Button/Button';
import Code from '../Code/Code';
import Input from '../Form/Input/Input';
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';
import Section from '../Section/Section';

type FieldValues = {
  name: string;
};

const SignUp = () => {
  const setUser = useUserUpdate();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const { control, handleSubmit } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    setSubmitError(null);
    setSubmitting(true);

    const existingUser = await fetchUser(data.name);

    if (existingUser) {
      saveToLocalStorage('user', existingUser);
      setUser(existingUser);
    } else {
      try {
        const newUser = await createUser(data.name);

        saveToLocalStorage('user', newUser);
        setUser(newUser);
      } catch (error) {
        console.error(error);
        setSubmitError(JSON.stringify(error));
      }

      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      style={{ display: 'contents' }}
    >
      <Section>
        <Controller
          control={control}
          defaultValue=""
          name="name"
          render={({ field }) => (
            <Input id="name" labelText="Name" type="text" {...field} />
          )}
          rules={{ required: true }}
        />

        <Button disabled={submitting} type="submit">
          Sign in
        </Button>
      </Section>

      {submitError && (
        <Section>
          <Heading>A terrible error happened!</Heading>

          <Paragraph>
            Let me know what you did and what it says below and I will fix it.
          </Paragraph>

          <Code>{submitError}</Code>
        </Section>
      )}
    </form>
  );
};

export default SignUp;
