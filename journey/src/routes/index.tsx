import { useEffect, useState } from 'react';
import * as contentful from 'contentful-management';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';
import { settings } from '../settings/settings';

// Helpers
import { calculateStreak } from '../helpers/streak';

// Components
import Button from '../components/Button/Button';
import Feedback from '../components/Feedback/Feedback';
import FormInput from '../components/Form/FormInput';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

// Contexts
import { useUser, useUserUpdate } from '../contexts/userContext';
import { useEvents, useEventsUpdate } from '../contexts/eventsContext';
import { useStreakUpdate } from '../contexts/streakContext';

// Types
import type { Event as EventType } from '../types/types';

const client = contentful.createClient({
  accessToken: settings.accessTokenManagement,
});

const Event = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const user = useUser();
  const setUser = useUserUpdate();
  const events = useEvents();
  const setEvents = useEventsUpdate();
  const setStreak = useStreakUpdate();

  const addEvent = async (
    event: EventType,
    reCalculateStreak: boolean = false,
  ) => {
    const result = [...events];

    result.unshift(event);
    setEvents(result);

    if (reCalculateStreak) {
      const streak = calculateStreak(user, result);
      setStreak(streak);

      if (!user) return;
      if (streak.streak <= (user?.bestStreak || 0)) return;

      // Save new best streak to user
      const userParams = {
        spaceId: settings.space,
        environmentId: settings.environment,
        entryId: user.id,
      };

      try {
        const currentEntry = await client.entry.get(userParams);

        const patchedEntry = await client.entry.patch(
          { ...userParams, version: currentEntry.sys.version },
          [
            {
              op: 'replace',
              path: '/fields/bestStreak/en-US',
              value: streak.streak,
            },
          ],
        );

        const publishedEntry = await client.entry.publish(
          userParams,
          patchedEntry,
        );

        const newUser = {
          bestStreak: publishedEntry.fields.bestStreak['en-US'],
          id: publishedEntry.sys.id,
          name: publishedEntry.fields.name['en-US'],
        };

        setUser(newUser);
      } catch (error) {
        console.error(error);
      }
    }
  };

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

  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!submitSuccess) return;

    const timeout = setTimeout(() => {
      setSubmitSuccess(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [submitSuccess]);

  const onSubmit = async (formData: { date: string; name: string }) => {
    setShowFeedback(true);
    setSubmitting(true);

    const temporaryEvent: EventType = {
      date: formData.date,
      name: formData.name,
      id: 'temp' + crypto.randomUUID(),
      user: user!,
    };

    // Add event to state.
    addEvent(temporaryEvent, true);

    try {
      // Create item.
      const entry = await client.entry.create(
        {
          spaceId: settings.space,
          environmentId: settings.environment,
          contentTypeId: 'workout',
        },
        {
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
        },
      );

      // Publish item.
      const publishedEntry = await client.entry.publish(
        {
          spaceId: settings.space,
          environmentId: settings.environment,
          entryId: entry.sys.id,
        },
        entry,
      );

      const publishedEvent: EventType = {
        ...temporaryEvent,
        id: publishedEntry.sys.id,
      };

      // Add event to state.
      addEvent(publishedEvent);

      // If there is a searchParam "name", remove it.
      if (searchParams?.name) navigate({ search: { name: undefined } });

      // Reset form.
      reset({ name: '' });

      // Reset submitError.
      setSubmitError(null);

      setSubmitSuccess(true);
    } catch (error) {
      setShowFeedback(false);

      // TODO: Make sure Streak is always up to date.
      // 1. If the request fails.
      // 2. Remove temporary event from state.
      // 2a. Make "deleteEvent" from "Event.tsx" into a hook or a global helper function.
      // 2b. Use hook.
      // 3. Recalculate streak.

      console.error(error);
      setSubmitError(JSON.stringify(error));
    } finally {
      setSubmitting(false);
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

export default Event;

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
