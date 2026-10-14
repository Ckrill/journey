// External
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

// Contexts
import { useUser } from '../contexts/userContext';

// Types
import type { Habit, Habits, Weekday } from '../types/types';

export interface HabitFormData {
  name: string;
  plannedDays: Weekday[];
}

const entryParams = (entryId: string) => ({
  entryId,
  environmentId: settings.environment,
  spaceId: settings.space,
});

/** Creates, edits, and archives habits. */
export const useHabitMutations = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  /* eslint-disable perfectionist/sort-objects */
  const create = useMutation<Habit, Error, HabitFormData>({
    retry: false,
    mutationFn: async ({ name, plannedDays }) => {
      if (!user) throw new Error('No user');
      const weeklyTarget = plannedDays.length;

      const entry = await client.entry.create(
        {
          contentTypeId: 'habit',
          environmentId: settings.environment,
          spaceId: settings.space,
        },
        {
          fields: {
            active: { 'en-US': true },
            name: { 'en-US': name },
            plannedDays: { 'en-US': plannedDays },
            user: {
              'en-US': {
                sys: { id: user.id, linkType: 'Entry', type: 'Link' },
              },
            },
            weeklyTarget: { 'en-US': weeklyTarget },
          },
        },
      );

      const published = await client.entry.publish(
        entryParams(entry.sys.id),
        entry,
      );

      return {
        active: true,
        createdAt: published.sys.createdAt,
        id: published.sys.id,
        name,
        plannedDays,
        weeklyTarget,
      };
    },
    onSuccess: (habit) => {
      queryClient.setQueryData<Habits>(['habits'], (old) => [
        ...(old ?? []),
        habit,
      ]);
    },
  });

  const update = useMutation<Habit, Error, Habit>({
    retry: false,
    mutationFn: async (habit) => {
      const params = entryParams(habit.id);
      const entry = await client.entry.get(params);

      type Fields = Record<string, Record<string, unknown>>;
      const fields = entry.fields as Fields;
      fields.name = { 'en-US': habit.name };
      fields.plannedDays = { 'en-US': habit.plannedDays };
      fields.weeklyTarget = { 'en-US': habit.weeklyTarget };
      fields.active = { 'en-US': habit.active };

      const updated = await client.entry.update(params, { ...entry, fields });
      await client.entry.publish(params, updated);
      return habit;
    },
    // The habits query only holds active habits, so an archived (inactive)
    // habit is dropped from the cache; an active one is replaced in place.
    onSuccess: (habit) => {
      queryClient.setQueryData<Habits>(['habits'], (old) => {
        const others = (old ?? []).filter((item) => item.id !== habit.id);
        return habit.active ? [...others, habit] : others;
      });
    },
  });

  const archive = (
    habit: Habit,
    options?: Parameters<typeof update.mutate>[1],
  ) => {
    update.mutate({ ...habit, active: false }, options);
  };
  /* eslint-enable perfectionist/sort-objects */

  return { archive, create, update };
};
