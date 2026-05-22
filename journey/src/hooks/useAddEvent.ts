import { useEffect, useState } from 'react';

// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

// Contexts
import { useUser } from '../contexts/userContext';
import { useEvents, useEventsUpdate } from '../contexts/eventsContext';
import { useStreakActions } from '../contexts/streakContext';

// Types
import type { Event as EventType } from '../types/types';

/** Manages event submission to Contentful with optimistic UI updates and streak tracking. */
export const useAddEvent = () => {
  const user = useUser();
  const events = useEvents();
  const setEvents = useEventsUpdate();
  const { refresh: refreshStreak, increment: incrementStreak } =
    useStreakActions();

  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!submitSuccess) return;

    const timeout = setTimeout(() => {
      setSubmitSuccess(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [submitSuccess]);

  const addEvent = (event: EventType) => {
    const result = [...events];
    result.unshift(event);
    setEvents(result);
  };

  const submitEvent = async (formData: { date: string; name: string }) => {
    if (!user) return { success: false };

    setShowFeedback(true);
    setSubmitting(true);

    const temporaryEvent: EventType = {
      date: formData.date,
      name: formData.name,
      id: 'temp' + crypto.randomUUID(),
      user: user,
    };

    // Add event to state.
    addEvent(temporaryEvent);

    // Optimistically update streak in UI
    incrementStreak();

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
                  id: user.id,
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

      setSubmitError(null);
      setSubmitSuccess(true);

      // Recalculate streak from local events and persist to Contentful
      const updatedEvents = [publishedEvent, ...events];
      void refreshStreak(updatedEvents);

      return { success: true };
    } catch (error) {
      setShowFeedback(false);

      // Roll back optimistic event
      setEvents(events.filter((e) => e.id !== temporaryEvent.id));

      // Recalculate streak from server (temp event was never persisted)
      void refreshStreak();

      console.error(error);
      setSubmitError(JSON.stringify(error));

      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showFeedback,
    setShowFeedback,
    submitting,
    submitError,
    submitSuccess,
    submitEvent,
  };
};
