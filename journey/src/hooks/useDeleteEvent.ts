// External
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

// Hooks
import { useStreakActions } from './useStreakQuery';

// Types
import type { Events } from '../types/types';

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { refresh: refreshStreak } = useStreakActions();

  /* eslint-disable perfectionist/sort-objects */
  return useMutation({
    retry: false,
    // Unpublish and delete the entry from Contentful
    mutationFn: async (entryId: string) => {
      const params = {
        entryId,
        environmentId: settings.environment,
        spaceId: settings.space,
      };

      const entry = await client.entry.get(params);
      await client.entry.unpublish(params, entry);
      await client.entry.delete(params);
    },
    // Optimistically remove the event from the cache
    onMutate: async (entryId) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });

      const previous = queryClient.getQueryData<Events>(['events']);

      queryClient.setQueryData<Events>(['events'], (old) =>
        old?.filter((event) => event.id !== entryId),
      );

      return { previous };
    },
    // Recalculate streak after successful deletion
    onSuccess: () => {
      const updatedEvents = queryClient.getQueryData<Events>(['events']);
      if (updatedEvents) void refreshStreak(updatedEvents);
    },
    // Restore previous cache state on failure
    onError: (_err, _entryId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['events'], context.previous);
      }
    },
  });
  /* eslint-enable perfectionist/sort-objects */
};
