// External
import { useForm } from 'react-hook-form';

// Utilities
import { errorMessage } from '../../helpers/errors';

// Hooks
import { useSaveReflection } from '../../hooks/useSaveReflection';

// Miscellaneous
import Button from '../Button/Button';
import FieldGroup from '../Form/FieldGroup/FieldGroup';
import FormActions from '../Form/FormActions/FormActions';
import Textarea from '../Form/Textarea/Textarea';
import ErrorMessage from '../Notice/ErrorMessage';
import SuccessMessage from '../Notice/SuccessMessage';

// Types
import type { Reflection } from '../../types/types';

const MAX_LENGTH = 2000;

const empty: Reflection = {
  blockers: '',
  nextSteps: '',
  plan: '',
  wentWell: '',
};

interface Props {
  /** Last saved answers, shown as placeholders until the user types. */
  previous: null | Reflection;
}

const ReflectionForm = ({ previous }: Props) => {
  const save = useSaveReflection();

  const {
    formState: { isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<Reflection>({ defaultValues: empty });

  const onSubmit = (data: Reflection) => {
    save.mutate(data, {
      onSuccess: () => {
        reset(empty);
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
    >
      <FieldGroup>
        <Textarea
          assistiveText="Lasting habits are built from small steps. Celebrate your wins, no matter how small they felt."
          autoComplete="off"
          disabled={save.isPending}
          id="retro-went-well"
          labelText="What went well?"
          maxLength={MAX_LENGTH}
          placeholder={previous?.wentWell}
          {...register('wentWell')}
        />

        <Textarea
          assistiveText="Honest reflections are the key to improvement. Was it low energy, a busy schedule, or a goal set too high?"
          autoComplete="off"
          disabled={save.isPending}
          id="retro-blockers"
          labelText="What got in your way?"
          maxLength={MAX_LENGTH}
          placeholder={previous?.blockers}
          {...register('blockers')}
        />

        <Textarea
          assistiveText="The easier a habit is to start, the more likely it sticks. Pick one small change to make starting easier."
          autoComplete="off"
          disabled={save.isPending}
          id="retro-next-steps"
          labelText="How can you remove some friction?"
          maxLength={MAX_LENGTH}
          placeholder={previous?.nextSteps}
          {...register('nextSteps')}
        />

        <Textarea
          assistiveText="Be realistic about your time and energy. What is the minimum version you can commit to on a hard day?"
          autoComplete="off"
          disabled={save.isPending}
          id="retro-plan"
          labelText="How will you meet your goal next week?"
          maxLength={MAX_LENGTH}
          placeholder={previous?.plan}
          {...register('plan')}
        />

        <FormActions>
          <Button disabled={save.isPending || !isDirty} type="submit">
            {save.isPending ? 'Saving' : 'Save reflection'}
          </Button>

          {save.isError && (
            <ErrorMessage>{errorMessage(save.error)}</ErrorMessage>
          )}

          {save.isSuccess && !isDirty && (
            <SuccessMessage>Saved. Saving again replaces it.</SuccessMessage>
          )}
        </FormActions>
      </FieldGroup>
    </form>
  );
};

export default ReflectionForm;
