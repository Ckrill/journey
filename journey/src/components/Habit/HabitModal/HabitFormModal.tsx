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
    register,
    reset,
  } = useForm<HabitFormData>({
    defaultValues: { name: '', plannedDays: [], weeklyTarget: 1 },
  });

  // Sync form values and clear stale mutation errors whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset({
      name: habit?.name ?? '',
      plannedDays: habit?.plannedDays ?? [],
      weeklyTarget: habit?.weeklyTarget ?? 1,
    });
  }, [open, habit, reset, resetCreate, resetUpdate]);

  const onSubmit = (data: HabitFormData) => {
    if (isEdit) {
      update.mutate(
        {
          ...habit,
          name: data.name,
          plannedDays: data.plannedDays,
          weeklyTarget: data.weeklyTarget,
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
  const title = isEdit ? 'Edit habit' : 'New habit';

  return (
    <Modal label={title} onClose={onClose} open={open}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <SectionContainer>
          <Section>
            <Heading>{title}</Heading>
          </Section>

          <Section>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  assistiveText="Name your habit."
                  disabled={isPending}
                  errorText={errors.name && 'Name your habit.'}
                  id="habit-name"
                  labelText="Name"
                  type="text"
                  {...field}
                />
              )}
              rules={{ required: true }}
            />

            <Input
              assistiveText="How many days per week."
              disabled={isPending}
              errorText={errors.weeklyTarget?.message}
              id="habit-weekly-target"
              inputMode="numeric"
              labelText="Weekly target"
              max={7}
              min={1}
              type="number"
              {...register('weeklyTarget', {
                max: { message: 'Pick a number from 1 to 7.', value: 7 },
                min: { message: 'Pick a number from 1 to 7.', value: 1 },
                required: 'Pick a number from 1 to 7.',
                valueAsNumber: true,
              })}
            />

            <Controller
              control={control}
              name="plannedDays"
              render={({ field }) => (
                <Pillbox
                  assistiveText="Optional. Select the days you plan to do this habit."
                  disabled={isPending}
                  labelText="Days"
                  name={field.name}
                  onChange={field.onChange}
                  options={dayOptions}
                  value={field.value}
                />
              )}
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
