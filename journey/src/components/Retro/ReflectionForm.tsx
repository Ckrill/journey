// External
import { useForm } from 'react-hook-form';

// Hooks
import { useSaveReflection } from '../../hooks/useSaveReflection';

// Miscellaneous
import Button from '../Button/Button';
import FormActions from '../Form/FormActions/FormActions';
import Textarea from '../Form/Textarea/Textarea';

// Types
import type { Reflection } from '../../types/types';

// Styles
import styles from './ReflectionForm.module.scss';

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
      <Textarea
        assistiveText="Celebrate your wins, big or small."
        disabled={save.isPending}
        id="retro-went-well"
        labelText="What went well?"
        maxLength={MAX_LENGTH}
        placeholder={previous?.wentWell}
        {...register('wentWell')}
      />

      <Textarea
        assistiveText="Honest reflections are the key to improvement."
        disabled={save.isPending}
        id="retro-blockers"
        labelText="What got in your way?"
        maxLength={MAX_LENGTH}
        placeholder={previous?.blockers}
        {...register('blockers')}
      />

      <Textarea
        assistiveText="Pick something small and concrete."
        disabled={save.isPending}
        id="retro-next-steps"
        labelText="How can you remove some friction?"
        maxLength={MAX_LENGTH}
        placeholder={previous?.nextSteps}
        {...register('nextSteps')}
      />

      <Textarea
        assistiveText="What is the minimum you can do?"
        disabled={save.isPending}
        id="retro-plan"
        labelText="Plan for next week. How will you meet your goal?"
        maxLength={MAX_LENGTH}
        placeholder={previous?.plan}
        {...register('plan')}
      />

      <FormActions>
        <Button disabled={save.isPending || !isDirty} type="submit">
          {save.isPending ? 'Saving' : 'Save reflection'}
        </Button>

        {save.isError && (
          <p className={styles.message} role="alert">
            Something went wrong. Please try again.
          </p>
        )}

        {save.isSuccess && !isDirty && (
          <p className={styles.message} role="status">
            Saved. Saving again replaces it.
          </p>
        )}
      </FormActions>
    </form>
  );
};

export default ReflectionForm;
