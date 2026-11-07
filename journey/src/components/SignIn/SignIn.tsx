// External
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FieldValues>();

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
      noValidate
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      style={{ display: 'contents' }}
    >
      <Section>
        <Input
          autoComplete="username"
          errorText={errors.email?.message}
          id="email"
          labelText="Email"
          required
          type="email"
          {...register('email', { required: 'Enter your email.' })}
        />

        <Input
          autoComplete="current-password"
          errorText={errors.password?.message ?? submitError ?? undefined}
          id="password"
          labelText="Password"
          required
          type="password"
          {...register('password', { required: 'Enter your password.' })}
        />

        <Button disabled={submitting} type="submit">
          {submitting ? 'Signing in' : 'Sign in'}
        </Button>
      </Section>
    </form>
  );
};

export default SignInForm;
