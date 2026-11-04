// External
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Miscellaneous
import { supabase } from '../../lib/supabase';
import Button from '../Button/Button';
import Input from '../Form/Input/Input';
import Section from '../Section/Section';

interface FieldValues {
  email: string;
  password: string;
}

const SignInForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const { control, handleSubmit } = useForm<FieldValues>();

  const onSubmit = async (values: FieldValues) => {
    setSubmitError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword(values);
    // On success the form fades out, so keep the button busy until it's gone.
    if (error) {
      setSubmitError(error.message);
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
          name="email"
          render={({ field }) => (
            <Input
              autoComplete="username"
              id="email"
              labelText="Email"
              required
              type="email"
              {...field}
            />
          )}
          rules={{ required: true }}
        />

        <Controller
          control={control}
          defaultValue=""
          name="password"
          render={({ field }) => (
            <Input
              autoComplete="current-password"
              errorText={submitError ?? undefined}
              id="password"
              labelText="Password"
              required
              type="password"
              {...field}
            />
          )}
          rules={{ required: true }}
        />

        <Button disabled={submitting} type="submit">
          {submitting ? 'Signing in' : 'Sign in'}
        </Button>
      </Section>
    </form>
  );
};

export default SignInForm;
