// External
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Utilities
import { toHabit, toReflection } from '../helpers/mappers';

// Contexts
import { useSession } from '../contexts/authContext';
import { useSettings } from '../contexts/settingsContext';

// Hooks
import { eventsQueryOptions } from './useEventsQuery';
import { retroReminderQueryOptions } from './useRetroReminderQuery';
import { useUserId } from './useUserId';

// Miscellaneous
import { supabase } from '../lib/supabase';

// The habits query only holds active habits; this one includes archived ones.
const fetchAllHabits = async () => {
  const { data, error } = await supabase
    .from('habits')
    .select(
      'id, name, planned_days, weekly_target, goal_description, goal_months, active, created_at',
    )
    .order('created_at');

  if (error) throw error;
  return data.map((row) => toHabit(row));
};

const fetchReflection = async () => {
  const { data, error } = await supabase
    .from('reflections')
    .select('went_well, blockers, next_steps, plan')
    .maybeSingle();

  if (error) throw error;
  return data ? toReflection(data) : null;
};

/** Collects the user's data and saves it to the device as a JSON file. */
export const useDownloadData = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  const session = useSession();
  const settings = useSettings();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const download = async () => {
    setBusy(true);
    setFailed(false);

    try {
      const [habits, events, reflection, retroReminder] = await Promise.all([
        fetchAllHabits(),
        queryClient.query(eventsQueryOptions(userId)),
        fetchReflection(),
        queryClient.query(retroReminderQueryOptions(userId)),
      ]);

      const data = {
        email: session?.user.email,
        habits: habits.map((habit) => ({
          active: habit.active,
          completedDates: events
            .filter((event) => event.habitId === habit.id)
            .map((event) => event.date),
          createdAt: habit.createdAt,
          name: habit.name,
          plannedDays: habit.plannedDays,
          weeklyTarget: habit.weeklyTarget,
        })),
        reflection,
        retroReminder,
        // Kept in this browser's local storage, not on the server.
        settings: {
          birthYear: settings.birthYear,
          bottomNavigation: settings.bottomNavigation,
          notifications: settings.notifications,
          region: settings.region,
          sex: settings.sex,
          sound: settings.sound,
          vibration: settings.vibration,
        },
      };

      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = 'journey-data.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return { busy, download, failed };
};
