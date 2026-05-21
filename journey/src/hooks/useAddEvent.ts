import { useEffect, useState } from 'react';

// Settings
import { settings } from '../settings/settings';

// Helpers
import { calculateStreak } from '../helpers/streak';

// API
import { client } from '../api/contentful';

// Contexts
import { useUser, useUserUpdate } from '../contexts/userContext';
import { useEvents, useEventsUpdate } from '../contexts/eventsContext';

// Types
import type { Event as EventType } from '../types/types';

export const useAddEvent = () => {
  const user = useUser();
  const setUser = useUserUpdate();
  const events = useEvents();
  const setEvents = useEventsUpdate();

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

  const addEvent = async (
    event: EventType,
    reCalculateStreak: boolean = false,
  ) => {
    const result = [...events];

    result.unshift(event);
    setEvents(result);

    if (reCalculateStreak) {
      const streak = calculateStreak(user, result);

      if (!user) return;
      if (streak.streak <= (user.bestStreak || 0)) return;

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

        type UserFields = {
          bestStreak: { 'en-US': number };
          name: { 'en-US': string };
        };
        const userFields = publishedEntry.fields as UserFields;

        const newUser = {
          bestStreak: userFields.bestStreak['en-US'],
          id: publishedEntry.sys.id,
          name: userFields.name['en-US'],
        };

        setUser(newUser);
      } catch (error) {
        console.error(error);
      }
    }
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
    void addEvent(temporaryEvent, true);

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
      void addEvent(publishedEvent);

      setSubmitError(null);
      setSubmitSuccess(true);

      return { success: true };
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
