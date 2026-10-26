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
import Paragraph from '../Paragraph/Paragraph';
import Section from '../Section/Section';
import SectionContainer from '../Section/SectionContainer';

interface FieldValues {
  confirmation: string;
}

interface Props {
  onClose: () => void;
  onDeleted: () => void;
  open: boolean;
}

const phrase = 'Nuke from orbit';

const DeleteAccountModal = ({ onClose, onDeleted, open }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<FieldValues>({
    defaultValues: { confirmation: '' },
  });

  // Start from an empty form (and no server error) each time the modal opens.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const serverError = errors.root?.server;

  const onSubmit = async () => {
    setDeleting(true);

    // Deletes the auth user; habits and events go with it via cascade.
    const { error } = await supabase.rpc('delete_account');
    setDeleting(false);

    if (error) {
      setError('root.server', { message: error.message });
    } else {
      setDeleted(true);
    }
  };

  // The account is gone, so leaving the confirmation means signing out.
  return deleted ? (
    <Modal label="Account deleted" onClose={onDeleted} open={open}>
      <SectionContainer>
        <Section>
          <Heading>Account deleted</Heading>

          <Paragraph>
            Your account and all of your data have been deleted.
          </Paragraph>

          <FormActions>
            <Button onClick={onDeleted} type="button">
              Okay
            </Button>
          </FormActions>
        </Section>
      </SectionContainer>
    </Modal>
  ) : (
    <Modal
      dismissible={!deleting}
      label="Delete account"
      onClose={onClose}
      open={open}
    >
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <SectionContainer>
          <Section>
            <Heading>Delete account</Heading>

            <Paragraph>
              This permanently deletes your account and all of your habits and
              history. It cannot be undone.
            </Paragraph>
          </Section>

          <Section>
            <Controller
              control={control}
              name="confirmation"
              render={({ field, fieldState }) => (
                <Input
                  assistiveText={`Type "${phrase}" to confirm.`}
                  autoComplete="off"
                  disabled={deleting}
                  errorText={fieldState.error?.message ?? serverError?.message}
                  id="delete-confirmation"
                  labelText="Confirmation"
                  required
                  type="text"
                  {...field}
                />
              )}
              rules={{
                validate: (value) =>
                  value.trim().toLowerCase() === phrase.toLowerCase() ||
                  `Type "${phrase}" to confirm.`,
              }}
            />

            <FormActions>
              <Button disabled={deleting} tone="danger" type="submit">
                {deleting ? 'Deleting' : 'Delete account'}
              </Button>
            </FormActions>
          </Section>
        </SectionContainer>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
