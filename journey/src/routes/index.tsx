import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Hooks
import { useAddEvent } from '../hooks/useAddEvent';

// Components
import Button from '../components/Button/Button';
import Feedback from '../components/Feedback/Feedback';
import FormInput from '../components/Form/FormInput';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

const Event = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const {
    showFeedback,
    setShowFeedback,
    submitting,
    submitError,
    submitSuccess,
    submitEvent,
  } = useAddEvent();

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

  const onSubmit = async (formData: { date: string; name: string }) => {
    const { success } = await submitEvent(formData);

    if (success) {
      // If there is a searchParam "name", remove it.
      if (searchParams?.name) navigate({ search: { name: undefined } });

      // Reset form.
      reset({ name: '' });
    }
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

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>
          <Section>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormInput
                  disabled={submitting}
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
                <FormInput
                  disabled={submitting}
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
            <Button disabled={submitSuccess || submitting} type="submit">
              {submitSuccess ? 'Saved!' : submitting ? 'Saving' : 'Save'}
            </Button>
          </Section>
        </form>

        {submitError && (
          <Section>
            <Heading>A terrible error happened!</Heading>

            <Paragraph>
              Let me know what you did and what it says below and I will fix it.
            </Paragraph>

            <code>{submitError}</code>
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
