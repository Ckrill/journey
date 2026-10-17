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
  const [submitError, setSubmitError] = useState<null | string>(null);
  const { control, getValues, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { confirm: '', password: '' },
  });

  // Start from an empty form each time the modal opens.
  useEffect(() => {
    if (!open) return;
    reset();
    setSubmitError(null);
  }, [open, reset]);

  const onSubmit = async ({ password }: FieldValues) => {
    setSubmitError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
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
                  errorText={
                    fieldState.error?.message ?? submitError ?? undefined
                  }
                  id="confirm-password"
                  labelText="Confirm new password"
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
