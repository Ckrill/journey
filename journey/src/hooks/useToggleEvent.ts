// External
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

// Utilities
import { toEvent } from '../helpers/mappers';

// Hooks
import { eventsKey } from './useEventsQuery';
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { Event, Events } from '../types/types';

interface ToggleArgs {
  date: string;
  habitId: string;
}

interface MutationContext {
  previous: Events | undefined;
}

// A locally-unique placeholder id for the optimistic event. It only needs to be
// distinct from other temp events currently in the cache (a user can't toggle
// two cells in the same millisecond), and it's swapped for the real id once the
// mutation resolves. Avoids crypto.randomUUID, which throws outside a secure
// context (e.g. mobile over plain HTTP).
const tempId = () => `temp${String(Date.now())}`;

/**
 * Toggles a single event for a habit on a given date.
 * Creates the event when absent, deletes it when present. The cell that
 * triggers this should disable itself while the mutation is pending.
 */
export const useToggleEvent = () => {
  const queryClient = useQueryClient();
  const queryKey = eventsKey(useUserId());
  // Snapshots the existing event per cell, captured in onMutate (before the
  // optimistic cache update) so mutationFn can tell create from delete.
  const snapshotsRef = useRef(new Map<string, Event | undefined>());

  /* eslint-disable perfectionist/sort-objects */
  return useMutation<Event | null, Error, ToggleArgs, MutationContext>({
    retry: false,
    mutationFn: async ({ date, habitId }) => {
      const key = `${habitId}|${date}`;
      const existing = snapshotsRef.current.get(key);
      snapshotsRef.current.delete(key);

      // Delete an existing (already-persisted) event.
      if (existing && !existing.id.startsWith('temp')) {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
        return null;
      }

      // Otherwise create a new one (user_id fills itself in from the token).
      const { data, error } = await supabase
        .from('events')
        .insert({ date, habit_id: habitId })
        .select('id, habit_id, date')
        .single();

      if (error) throw error;
      return toEvent(data);
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

    // Swap the optimistic entry for the server result. No refetch is needed:
    // the cache already matches what was written.
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
