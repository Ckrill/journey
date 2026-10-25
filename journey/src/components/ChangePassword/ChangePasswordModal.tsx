// External
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Miscellaneous
import { supabase } from '../../lib/supabase';
import Button from '../Button/Button';
import FormActions from '../Form/FormActions/FormActions';
import Input from '../Form/Input/Input';
import Heading from '../Heading/Heading';
import Modal from '../Modal/Modal';
import Section from '../Section/Section';
import SectionContainer from '../Section/SectionContainer';

interface FieldValues {
  confirm: string;
  password: string;
}

interface Props {
  onClose: () => void;
  onSaved: () => void;
  open: boolean;
}

const minLength = 8;

const ChangePasswordModal = ({ onClose, onSaved, open }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
    setError,
  } = useForm<FieldValues>({
    defaultValues: { confirm: '', password: '' },
  });

  // Start from an empty form (and no server error) each time the modal opens.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const serverError = errors.root?.server;

  const onSubmit = async ({ password }: FieldValues) => {
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError('root.server', { message: error.message });
    } else {
      onSaved();
    }
  };

  return (
    <Modal label="Change password" onClose={onClose} open={open}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <SectionContainer>
          <Section>
            <Heading>Change password</Heading>
          </Section>

          <Section>
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  autoComplete="new-password"
                  disabled={submitting}
                  errorText={fieldState.error?.message}
                  id="new-password"
                  labelText="New password"
                  required
                  type="password"
                  {...field}
                />
              )}
              rules={{
                minLength: {
                  message: `Use at least ${String(minLength)} characters.`,
                  value: minLength,
                },
                required: 'Enter a new password.',
              }}
            />

            <Controller
              control={control}
              name="confirm"
              render={({ field, fieldState }) => (
                <Input
                  autoComplete="new-password"
                  disabled={submitting}
                  errorText={fieldState.error?.message ?? serverError?.message}
                  id="confirm-password"
                  labelText="Confirm new password"
                  required
                  type="password"
                  {...field}
                />
              )}
              rules={{
                required: 'Repeat the new password.',
                validate: (value) =>
                  value === getValues('password') ||
                  'The passwords do not match.',
              }}
            />

            <FormActions>
              <Button disabled={submitting} type="submit">
                {submitting ? 'Saving' : 'Change password'}
              </Button>
            </FormActions>
          </Section>
        </SectionContainer>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
