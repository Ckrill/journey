// External
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Utilities
import { WEEKDAY_LABELS, WEEKDAYS } from '../../../helpers/week';

// Hooks
import {
  type HabitFormData,
  useHabitMutations,
} from '../../../hooks/useHabitMutations';

// Miscellaneous
import Button from '../../Button/Button';
import FormActions from '../../Form/FormActions/FormActions';
import Input from '../../Form/Input/Input';
import Pillbox from '../../Form/Pillbox/Pillbox';
import Heading from '../../Heading/Heading';
import Modal from '../../Modal/Modal';
import Section from '../../Section/Section';
import SectionContainer from '../../Section/SectionContainer';

// Types
import type { Habit, Weekday } from '../../../types/types';
import type { PillboxOption } from '../../Form/Pillbox/Pillbox';

// Styles
import styles from './HabitFormModal.module.scss';

const dayOptions: PillboxOption<Weekday>[] = WEEKDAYS.map((value, index) => ({
  display: WEEKDAY_LABELS[index][0],
  label: WEEKDAY_LABELS[index],
  value,
}));

interface Props {
  habit: Habit | null;
  onClose: () => void;
  open: boolean;
}

const HabitFormModal = ({ habit, onClose, open }: Props) => {
  const { archive, create, update } = useHabitMutations();
  const isEdit = habit !== null;

  // React Query mutation objects are recreated each render, but their `reset`
  // methods are stable — depend on those, not the whole mutation.
  const { reset: resetCreate } = create;
  const { reset: resetUpdate } = update;

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<HabitFormData>({
    defaultValues: { name: '', plannedDays: [] },
  });

  // Sync form values and clear stale mutation errors whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset({
      name: habit?.name ?? '',
      plannedDays: habit?.plannedDays ?? [],
    });
  }, [open, habit, reset, resetCreate, resetUpdate]);

  const onSubmit = (data: HabitFormData) => {
    if (isEdit) {
      update.mutate(
        {
          ...habit,
          name: data.name,
          plannedDays: data.plannedDays,
          weeklyTarget: data.plannedDays.length,
        },
        { onSuccess: onClose },
      );
    } else {
      create.mutate(data, { onSuccess: onClose });
    }
  };

  const handleArchive = () => {
    if (habit) archive(habit, { onSuccess: onClose });
  };

  const isPending = create.isPending || update.isPending;
  const mutationError = create.error ?? update.error;

  return (
    <Modal onClose={onClose} open={open}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <SectionContainer>
          <Section>
            <Heading>{isEdit ? 'Edit habit' : 'New habit'}</Heading>
          </Section>

          <Section>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  assistiveText="Name your habit."
                  disabled={isPending}
                  errorText={errors.name && 'Please name your habit.'}
                  id="habit-name"
                  labelText="Name"
                  type="text"
                  {...field}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="plannedDays"
              render={({ field }) => (
                <Pillbox
                  assistiveText="Select the days you plan to do this habit."
                  disabled={isPending}
                  errorText={errors.plannedDays && 'Pick at least one day.'}
                  labelText="Days"
                  name={field.name}
                  onChange={field.onChange}
                  options={dayOptions}
                  value={field.value}
                />
              )}
              rules={{ validate: (days) => days.length > 0 }}
            />

            <FormActions>
              <Button disabled={isPending} type="submit">
                {isPending ? 'Saving' : 'Save'}
              </Button>

              {mutationError && (
                <p className={styles.error} role="alert">
                  Something went wrong. Please try again.
                </p>
              )}

              {isEdit && (
                <Button
                  data-priority="secondary"
                  data-tone="danger"
                  disabled={isPending}
                  onClick={handleArchive}
                  type="button"
                >
                  Archive habit
                </Button>
              )}
            </FormActions>
          </Section>
        </SectionContainer>
      </form>
    </Modal>
  );
};

export default HabitFormModal;
