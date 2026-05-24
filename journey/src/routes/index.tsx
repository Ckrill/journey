import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Hooks
import { useSubmitEvent } from '../hooks/useSubmitEvent';

// Components
import Button from '../components/Button/Button';
import Feedback from '../components/Feedback/Feedback';
import Input from '../components/Form/Input/Input';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

const Event = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const mutation = useSubmitEvent();
  const [showFeedback, setShowFeedback] = useState(false);

  const { isSuccess, reset: resetMutation } = mutation;

  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      date: currentDate,
      name: searchParams?.name || '',
    },
  });

  // Auto-reset success state after 1s (for button text)
  useEffect(() => {
    if (!isSuccess) return;

    const timeout = setTimeout(() => {
      resetMutation();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isSuccess, resetMutation]);

  const onSubmit = (formData: { date: string; name: string }) => {
    setShowFeedback(true);

    mutation.mutate(formData, {
      onSuccess: () => {
        // If there is a searchParam "name", remove it.
        if (searchParams?.name) void navigate({ search: { name: undefined } });

        // Reset form.
        reset({ name: '' });
      },
      onError: () => {
        setShowFeedback(false);
      },
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <SectionContainer>
        <Section>
          <Heading>Add event</Heading>
        </Section>

        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
          style={{ display: 'contents' }}
        >
          <Section>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  disabled={mutation.isPending}
                  errorText={errors.name && 'Please fill out this field.'}
                  id="event"
                  labelText="Event"
                  type="text"
                  {...field}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Input
                  disabled={mutation.isPending}
                  errorText={errors.date && 'Please fill out this field.'}
                  id="date"
                  labelText="Day"
                  type="date"
                  {...field}
                />
              )}
              rules={{ required: true }}
            />
          </Section>

          <Section>
            <Button
              disabled={mutation.isSuccess || mutation.isPending}
              type="submit"
            >
              {mutation.isSuccess
                ? 'Saved!'
                : mutation.isPending
                  ? 'Saving'
                  : 'Save'}
            </Button>
          </Section>
        </form>

        {mutation.isError && (
          <Section>
            <Heading>A terrible error happened!</Heading>

            <Paragraph>
              Let me know what you did and what it says below and I will fix it.
            </Paragraph>

            <code>{String(mutation.error)}</code>
          </Section>
        )}
      </SectionContainer>

      <Feedback setShow={setShowFeedback} show={showFeedback} />
    </motion.div>
  );
};

type EventParams =
  | {
      name: string | undefined;
    }
  | undefined;

export const Route = createFileRoute('/')({
  component: Event,
  validateSearch: (search: Record<string, unknown>): EventParams => {
    // validate and parse the search params into a typed state
    const hasName = !!search.name;

    return hasName
      ? {
          name: search.name as string,
        }
      : undefined;
  },
});
