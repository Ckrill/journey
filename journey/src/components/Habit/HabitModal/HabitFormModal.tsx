// External
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Hooks
import {
  type HabitFormData,
  useHabitMutations,
} from '../../../hooks/useHabitMutations';

// Miscellaneous
import Button from '../../Button/Button';
import Input from '../../Form/Input/Input';
import Heading from '../../Heading/Heading';
import Modal from '../../Modal/Modal';
import Section from '../../Section/Section';
import SectionContainer from '../../Section/SectionContainer';

// Types
import type { Habit } from '../../../types/types';

// Styles
import styles from './HabitFormModal.module.scss';

type Props = {
  habit: Habit | null;
  onClose: () => void;
  open: boolean;
};

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
    defaultValues: { name: '', weeklyTarget: 3 },
  });

  // Sync form values and clear stale mutation errors whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset({
      name: habit?.name ?? '',
      weeklyTarget: habit?.weeklyTarget ?? 3,
    });
  }, [open, habit, reset, resetCreate, resetUpdate]);

  const onSubmit = (data: HabitFormData) => {
    if (isEdit) {
      update.mutate(
        { ...habit, name: data.name, weeklyTarget: data.weeklyTarget },
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
              name="weeklyTarget"
              render={({ field }) => (
                <Input
                  disabled={isPending}
                  errorText={errors.weeklyTarget && 'Pick a value from 1 to 7.'}
                  id="habit-target"
                  labelText="Days per week"
                  max={7}
                  min={1}
                  type="number"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              )}
              rules={{ max: 7, min: 1, required: true }}
            />

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
          </Section>
        </SectionContainer>
      </form>
    </Modal>
  );
};

export default HabitFormModal;
