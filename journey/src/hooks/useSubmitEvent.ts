// External
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

// Contexts
import { useUser } from '../contexts/userContext';

// Hooks
import { useStreakActions } from './useStreakQuery';

// Types
import type { Events, Event as EventType } from '../types/types';

type FormData = { date: string; name: string };

type MutationContext = {
  previous: Events | undefined;
  temporaryEvent: EventType;
};

export const useSubmitEvent = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { increment: incrementStreak, refresh: refreshStreak } =
    useStreakActions();

  /* eslint-disable perfectionist/sort-objects */
  return useMutation<EventType, Error, FormData, MutationContext>({
    retry: false,
    // Create and publish the event in Contentful
    mutationFn: async (formData) => {
      if (!user) throw new Error('No user');

      const entry = await client.entry.create(
        {
          contentTypeId: 'workout',
          environmentId: settings.environment,
          spaceId: settings.space,
        },
        {
          fields: {
            date: { 'en-US': formData.date },
            name: { 'en-US': formData.name },
            user: {
              'en-US': {
                sys: { id: user.id, linkType: 'Entry', type: 'Link' },
              },
            },
          },
        },
      );

      const publishedEntry = await client.entry.publish(
        {
          entryId: entry.sys.id,
          environmentId: settings.environment,
          spaceId: settings.space,
        },
        entry,
      );

      const publishedEvent: EventType = {
        date: formData.date,
        id: publishedEntry.sys.id,
        name: formData.name,
        user: user,
      };

      return publishedEvent;
    },
    // Optimistically insert a temporary event and increment the streak
    onMutate: async (formData) => {
      if (!user)
        return { temporaryEvent: {} as EventType, previous: undefined };

      await queryClient.cancelQueries({ queryKey: ['events'] });

      const previous = queryClient.getQueryData<Events>(['events']);

      const temporaryEvent: EventType = {
        date: formData.date,
        id: 'temp' + crypto.randomUUID(),
        name: formData.name,
        user: user,
      };

      queryClient.setQueryData<Events>(['events'], (old) => [
        temporaryEvent,
        ...(old ?? []),
      ]);

      incrementStreak();

      return { previous, temporaryEvent };
    },
    // Replace the temp event with the real one and recalculate the streak
    onSuccess: (publishedEvent, _formData, context) => {
      queryClient.setQueryData<Events>(['events'], (old) =>
        old?.map((event) =>
          event.id === context.temporaryEvent.id ? publishedEvent : event,
        ),
      );

      // Recalculate streak from local events
      const updatedEvents = queryClient.getQueryData<Events>(['events']);
      if (updatedEvents) void refreshStreak(updatedEvents);
    },
    // Restore previous cache state and recalculate streak from server
    onError: (_err, _formData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['events'], context.previous);
      }

      void refreshStreak();
    },
  });
  /* eslint-enable perfectionist/sort-objects */
};
