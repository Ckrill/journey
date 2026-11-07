// External
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';

// Utilities
import { errorMessage } from '../../../helpers/errors';
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
import Textarea from '../../Form/Textarea/Textarea';
import Heading from '../../Heading/Heading';
import Modal from '../../Modal/Modal';
import ErrorMessage from '../../Notice/ErrorMessage';
import Paragraph from '../../Paragraph/Paragraph';
import ParagraphGroup from '../../ParagraphGroup/ParagraphGroup';
import Section from '../../Section/Section';
import SectionContainer from '../../Section/SectionContainer';

// Types
import type { Habit } from '../../../types/types';
import type { PillboxOption } from '../../Form/Pillbox/Pillbox';

const dayOptions: PillboxOption[] = WEEKDAYS.map((value, index) => ({
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
  const titleId = useId();
  const { archive, create, update } = useHabitMutations();
  const isEdit = habit !== null;

  // React Query mutation objects are recreated each render, but their `reset`
  // methods are stable — depend on those, not the whole mutation.
  const { reset: resetCreate } = create;
  const { reset: resetUpdate } = update;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<HabitFormData>({
    defaultValues: {
      goalDescription: '',
      goalMonths: null,
      name: '',
      plannedDays: [],
    },
  });

  // Sync form values and clear stale mutation errors whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset({
      goalDescription: habit?.goalDescription ?? '',
      goalMonths: habit?.goalMonths ?? null,
      name: habit?.name ?? '',
      plannedDays: habit?.plannedDays ?? [],
      weeklyTarget: habit?.weeklyTarget,
    });
  }, [open, habit, reset, resetCreate, resetUpdate]);

  const onSubmit = (formData: HabitFormData) => {
    // An empty duration input comes through as NaN.
    const data = {
      ...formData,
      goalMonths: Number.isNaN(formData.goalMonths)
        ? null
        : formData.goalMonths,
    };

    if (isEdit) {
      update.mutate(
        {
          ...habit,
          goalDescription: data.goalDescription,
          goalMonths: data.goalMonths,
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
    <Modal labelledBy={titleId} onClose={onClose} open={open}>
      <form
        noValidate
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <SectionContainer>
          <Section>
            <Heading id={titleId} level={1}>
              {title}
            </Heading>

            <ParagraphGroup
              more={
                <Paragraph>
                  Use the retro to reflect on your progress and adjust your
                  habits accordingly.
                </Paragraph>
              }
            >
              <Paragraph>
                The best way to build a habit is to start small and be
                consistent. It is OK to miss a day, it happens to everyone, but
                try not to miss two days.
              </Paragraph>
            </ParagraphGroup>
          </Section>

          <Section>
            {/* Registered with `register` like the fields below, so the error focus order follows the page. */}
            <Input
              assistiveText="Name your habit."
              autoComplete="off"
              data-1p-ignore
              disabled={isPending}
              errorText={errors.name && 'Name your habit.'}
              id="habit-name"
              labelText="Name"
              required
              type="text"
              {...register('name', { required: true })}
            />

            <Input
              assistiveText="How many days per week?"
              autoComplete="off"
              disabled={isPending}
              errorText={errors.weeklyTarget?.message}
              id="habit-weekly-target"
              inputMode="numeric"
              labelText="Weekly target"
              max={7}
              min={1}
              required
              suffix="days"
              type="number"
              {...register('weeklyTarget', {
                max: { message: 'Pick a number from 1 to 7.', value: 7 },
                min: { message: 'Pick a number from 1 to 7.', value: 1 },
                required: 'Pick a number from 1 to 7.',
                valueAsNumber: true,
              })}
            />

            <Pillbox
              assistiveText="Select the days you plan to do this habit."
              disabled={isPending}
              labelText="Days"
              options={dayOptions}
              {...register('plannedDays')}
            />

            <Textarea
              assistiveText="What does reaching your goal look like?"
              autoComplete="off"
              disabled={isPending}
              errorText={errors.goalDescription?.message}
              id="habit-goal-description"
              labelText="Make it tangible"
              maxLength={500}
              rows={3}
              {...register('goalDescription')}
            />

            <Input
              assistiveText="When do you reach your goal?"
              autoComplete="off"
              data-1p-ignore
              disabled={isPending}
              errorText={errors.goalMonths?.message}
              id="habit-goal-months"
              inputMode="numeric"
              labelText="Duration"
              max={60}
              min={1}
              suffix="months"
              type="number"
              {...register('goalMonths', {
                max: { message: 'Pick a number from 1 to 60.', value: 60 },
                min: { message: 'Pick a number from 1 to 60.', value: 1 },
                valueAsNumber: true,
              })}
            />

            <FormActions>
              <Button disabled={isPending} type="submit">
                {isPending ? 'Saving' : 'Save habit'}
              </Button>

              {isEdit && (
                <Button
                  disabled={isPending}
                  onClick={handleArchive}
                  priority="secondary"
                  tone="danger"
                  type="button"
                >
                  Archive habit
                </Button>
              )}

              <Button onClick={onClose} priority="secondary" type="button">
                Cancel
              </Button>

              {mutationError && (
                <ErrorMessage>{errorMessage(mutationError)}</ErrorMessage>
              )}
            </FormActions>
          </Section>
        </SectionContainer>
      </form>
    </Modal>
  );
};

export default HabitFormModal;
