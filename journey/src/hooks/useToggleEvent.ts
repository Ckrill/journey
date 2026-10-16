// External
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

// Contexts
import { useUser } from '../contexts/userContext';

// Hooks
import { eventsKey } from './useEventsQuery';

// Types
import type { Event, Events } from '../types/types';

interface ToggleArgs {
  date: string;
  habitId: string;
  habitName: string;
}

interface MutationContext {
  previous: Events | undefined;
}

const entryParams = (entryId: string) => ({
  entryId,
  environmentId: settings.environment,
  spaceId: settings.space,
});

// A locally-unique placeholder id for the optimistic event. It only needs to be
// distinct from other temp events currently in the cache (a user can't toggle
// two cells in the same millisecond), and it's swapped for the real Contentful
// id once the mutation resolves. Avoids crypto.randomUUID, which throws outside
// a secure context (e.g. mobile over plain HTTP).
const tempId = () => `temp${String(Date.now())}`;

/**
 * Toggles a single event for a habit on a given date.
 * Creates the event when absent, deletes it when present. The cell that
 * triggers this should disable itself while the mutation is pending.
 */
export const useToggleEvent = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const queryKey = eventsKey(user.id);
  // Snapshots the existing event per cell, captured in onMutate (before the
  // optimistic cache update) so mutationFn can tell create from delete.
  const snapshotsRef = useRef(new Map<string, Event | undefined>());

  /* eslint-disable perfectionist/sort-objects */
  return useMutation<Event | null, Error, ToggleArgs, MutationContext>({
    retry: false,
    mutationFn: async ({ date, habitId, habitName }) => {
      const key = `${habitId}|${date}`;
      const existing = snapshotsRef.current.get(key);
      snapshotsRef.current.delete(key);

      // Delete an existing (already-persisted) event.
      if (existing && !existing.id.startsWith('temp')) {
        const params = entryParams(existing.id);
        const entry = await client.entry.get(params);
        await client.entry.unpublish(params, entry);
        await client.entry.delete(params);
        return null;
      }

      // Otherwise create a new one.
      const created = await client.entry.create(
        {
          contentTypeId: 'event',
          environmentId: settings.environment,
          spaceId: settings.space,
        },
        {
          fields: {
            date: { 'en-US': date },
            habit: {
              'en-US': {
                sys: { id: habitId, linkType: 'Entry', type: 'Link' },
              },
            },
            name: { 'en-US': `${habitName} - ${date}` },
          },
        },
      );

      await client.entry.publish(entryParams(created.sys.id), created);
      return { date, habitId, id: created.sys.id };
    },

    // Optimistically flip the cell.
    onMutate: async ({ date, habitId }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Events>(queryKey);

      // Capture the current event BEFORE mutating the cache below.
      const existing = previous?.find(
        (event) => event.habitId === habitId && event.date === date,
      );
      snapshotsRef.current.set(`${habitId}|${date}`, existing);

      queryClient.setQueryData<Events>(queryKey, (old) => {
        const events = old ?? [];

        if (existing) {
          return events.filter(
            (event) => !(event.habitId === habitId && event.date === date),
          );
        }

        const temporaryEvent: Event = {
          date,
          habitId,
          id: tempId(),
        };
        return [temporaryEvent, ...events];
      });

      return { previous };
    },

    // Reconcile the optimistic cache with the server result. We avoid refetching
    // because reads hit the eventually-consistent CDN, which would briefly
    // return stale data and revert the cell.
    onSuccess: (result, { date, habitId }) => {
      queryClient.setQueryData<Events>(queryKey, (old) => {
        const events = old ?? [];
        const others = events.filter(
          (event) => !(event.habitId === habitId && event.date === date),
        );
        return result ? [result, ...others] : others;
      });
    },

    // Roll the cell back to its pre-toggle state if the mutation fails.
    onError: (_err, _args, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });
  /* eslint-enable perfectionist/sort-objects */
};
