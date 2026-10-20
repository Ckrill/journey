// External
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Utilities
import { toHabit } from '../helpers/mappers';

// Hooks
import { habitsKey } from './useHabitsQuery';
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// Types
import type { Habit, Habits, Weekday } from '../types/types';

export interface HabitFormData {
  name: string;
  plannedDays: Weekday[];
  weeklyTarget: number;
}

const columns = 'id, name, planned_days, weekly_target, active, created_at';

/** Creates, edits, and archives habits. */
export const useHabitMutations = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  /* eslint-disable perfectionist/sort-objects */
  const create = useMutation<Habit, Error, HabitFormData>({
    retry: false,
    mutationFn: async ({ name, plannedDays, weeklyTarget }) => {
      // user_id fills itself in from the signed-in user.
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name,
          planned_days: plannedDays,
          weekly_target: weeklyTarget,
        })
        .select(columns)
        .single();

      if (error) throw error;
      return toHabit(data);
    },
    onSuccess: (habit) => {
      queryClient.setQueryData<Habits>(habitsKey(userId), (old) => [
        ...(old ?? []),
        habit,
      ]);
    },
  });

  const update = useMutation<Habit, Error, Habit>({
    retry: false,
    mutationFn: async (habit) => {
      const { data, error } = await supabase
        .from('habits')
        .update({
          active: habit.active,
          name: habit.name,
          planned_days: habit.plannedDays,
          weekly_target: habit.weeklyTarget,
        })
        .eq('id', habit.id)
        .select(columns)
        .single();

      if (error) throw error;
      return toHabit(data);
    },
    // The habits query only holds active habits, so an archived (inactive)
    // habit is dropped from the cache; an active one is replaced in place.
    onSuccess: (habit) => {
      queryClient.setQueryData<Habits>(habitsKey(userId), (old) => {
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
