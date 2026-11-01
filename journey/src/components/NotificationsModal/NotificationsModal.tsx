// External
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

// Hooks
import { useRetroReminderMutations } from '../../hooks/useRetroReminderMutations';
import { useRetroReminderQuery } from '../../hooks/useRetroReminderQuery';

// Miscellaneous
import Button from '../Button/Button';
import ButtonGroup from '../Button/ButtonGroup';
import Checkbox from '../Form/Checkbox/Checkbox';
import CheckboxGroup from '../Form/Checkbox/CheckboxGroup';
import FormActions from '../Form/FormActions/FormActions';
import Input from '../Form/Input/Input';
import Select from '../Form/Select/Select';
import Heading from '../Heading/Heading';
import Modal from '../Modal/Modal';
import Section from '../Section/Section';
import SectionContainer from '../Section/SectionContainer';

// Types
import type { RetroReminder, Weekday } from '../../types/types';

const weekdayOptions: { label: string; value: Weekday }[] = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' },
];

const toFieldValues = (reminder: null | RetroReminder): FieldValues => ({
  enabled: reminder !== null,
  time: reminder?.time ?? '18:00',
  weekday: reminder?.weekday ?? 'sun',
});

interface Props {
  onClose: () => void;
  open: boolean;
}

interface FieldValues {
  enabled: boolean;
  time: string;
  weekday: Weekday;
}

const NotificationsModal = ({ onClose, open }: Props) => {
  const { data: reminder } = useRetroReminderQuery();
  const { remove, save } = useRetroReminderMutations();
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setError,
  } = useForm<FieldValues>({ defaultValues: toFieldValues(reminder) });
  const enabled = useWatch({ control, name: 'enabled' });
  const pending = save.isPending || remove.isPending;

  // Start from the saved reminder (and no earlier error) each time the modal opens.
  useEffect(() => {
    if (open) reset(toFieldValues(reminder));
  }, [open, reminder, reset]);

  const onSubmit = ({ enabled: on, time, weekday }: FieldValues) => {
    // Saving clears the reminder's last-sent date, so it could fire a second time.
    if (!isDirty) {
      onClose();
      return;
    }
    const callbacks = {
      onError: () => {
        setError('root.server', {
          message: 'Something went wrong. Please try again.',
        });
      },
      onSuccess: onClose,
    };

    if (on) {
      save.mutate({ time, weekday }, callbacks);
    } else if (reminder) {
      remove.mutate(undefined, callbacks);
    } else {
      onClose();
    }
  };

  const timeZone = (reminder?.timeZone ?? Temporal.Now.timeZoneId()).replaceAll(
    '_',
    ' ',
  );

  return (
    <Modal label="Configure notifications" onClose={onClose} open={open}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <SectionContainer>
          <Section>
            <Heading>Notifications</Heading>
          </Section>

          <Section>
            <Controller
              control={control}
              name="enabled"
              render={({ field }) => (
                <CheckboxGroup>
                  <Checkbox
                    callback={() => {
                      field.onChange(!field.value);
                    }}
                    checked={field.value}
                    id="retro-reminder"
                    label="Retro reminder"
                  />
                </CheckboxGroup>
              )}
            />

            <Controller
              control={control}
              name="weekday"
              render={({ field }) => (
                <Select
                  disabled={!enabled}
                  id="retro-reminder-day"
                  labelText="Day"
                  options={weekdayOptions}
                  required={enabled}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="time"
              render={({ field, fieldState }) => (
                <Input
                  assistiveText={`Time zone: ${timeZone}. Saving updates it to this device's time zone.`}
                  disabled={!enabled}
                  errorText={fieldState.error?.message}
                  id="retro-reminder-time"
                  labelText="Time"
                  required={enabled}
                  type="time"
                  {...field}
                />
              )}
              rules={{
                validate: (value, { enabled: on }) =>
                  !on || value !== '' || 'Enter a time.',
              }}
            />

            <FormActions>
              <ButtonGroup errorText={errors.root?.server.message}>
                <Button disabled={pending} type="submit">
                  {pending ? 'Saving' : 'Save'}
                </Button>
              </ButtonGroup>
            </FormActions>
          </Section>
        </SectionContainer>
      </form>
    </Modal>
  );
};

export default NotificationsModal;
