import React, { useEffect, useState } from 'react';
import * as contentful from 'contentful-management';
import { Controller, useForm } from 'react-hook-form';

// Settings
import { settings } from '../settings/settings';

// Components
import Button from '../components/Button/Button';
import Feedback from '../components/Feedback/Feedback';
import FormInput from '../components/Form/FormInput';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

// Types
import { User, Workout as WorkoutType, Workouts } from '../types/types';
import { useSearchParams } from 'react-router-dom';

const client = contentful.createClient({
  accessToken:
    process.env.REACT_APP_CONTENTFUL_USER ||
    settings.accessTokenManagement ||
    '',
});

type Props = {
  addEvent: (event: WorkoutType) => void;
  events: Workouts;
  user: User;
};

const Workout = ({ addEvent, events, user }: Props) => {
  const [searchParams] = useSearchParams();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      name: searchParams.get('name') || '',
    },
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!submitSuccess) return;

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 1000);
  }, [submitSuccess]);

  const onSubmit = (formData: { date: string; name: string }) => {
    setShowFeedback(true);
    setSubmitting(true);

    const temporaryWorkout: WorkoutType = {
      date: formData.date,
      name: formData.name,
      id: 'temp' + Date.now(),
      user,
    };

    // Add event to state.
    addEvent(temporaryWorkout);

    // Create and publish item.
    client
      .getSpace(settings.space)
      .then((space) => space.getEnvironment(settings.environment))
      .then((environment) =>
        environment.createEntry('workout', {
          fields: {
            date: {
              'en-US': formData.date,
            },
            name: {
              'en-US': formData.name,
            },
            user: {
              'en-US': {
                sys: {
                  id: user?.id,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
          },
        })
      )
      .then((entry) => entry.publish())
      .then((entry) => {
        const publishedWorkout: WorkoutType = {
          ...temporaryWorkout,
          id: entry.sys.id,
        };

        // Add event to state.
        addEvent(publishedWorkout);

        // Reset form.
        reset();

        // Reset submitError.
        setSubmitError(null);

        setSubmitSuccess(true);
      })
      .catch((error) => {
        setShowFeedback(false);

        console.error(error);
        setSubmitError(JSON.stringify(error));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <SectionContainer>
        <Section>
          <Heading>Add workout</Heading>
        </Section>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>
          <Section>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormInput
                  autoFocus={true}
                  disabled={submitting}
                  errorText={errors.name && 'Please fill out this field.'}
                  id="workout"
                  labelText="Workout"
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

      <Feedback
        setShow={setShowFeedback}
        show={showFeedback}
        user={user}
        workouts={events}
      />
    </>
  );
};

export default Workout;
