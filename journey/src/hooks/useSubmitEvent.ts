import { useMutation, useQueryClient } from '@tanstack/react-query';

// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

// Contexts
import { useUser } from '../contexts/userContext';
import { useStreakActions } from '../contexts/streakContext';

// Types
import type { Event as EventType, Events } from '../types/types';

type FormData = { date: string; name: string };

type MutationContext = {
  temporaryEvent: EventType;
  previous: Events | undefined;
};

export const useSubmitEvent = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { refresh: refreshStreak, increment: incrementStreak } =
    useStreakActions();

  return useMutation<EventType, Error, FormData, MutationContext>({
    // Create and publish the event in Contentful
    mutationFn: async (formData) => {
      if (!user) throw new Error('No user');

      const entry = await client.entry.create(
        {
          spaceId: settings.space,
          environmentId: settings.environment,
          contentTypeId: 'workout',
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
          spaceId: settings.space,
          environmentId: settings.environment,
          entryId: entry.sys.id,
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
        name: formData.name,
        id: 'temp' + crypto.randomUUID(),
        user: user,
      };

      queryClient.setQueryData<Events>(['events'], (old) => [
        temporaryEvent,
        ...(old ?? []),
      ]);

      incrementStreak();

      return { temporaryEvent, previous };
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
};
