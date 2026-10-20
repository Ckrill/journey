// External
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Utilities
import { toHabit } from '../../helpers/mappers';

// Contexts
import { useSession } from '../../contexts/authContext';
import { useSettings } from '../../contexts/settingsContext';

// Hooks
import { eventsQueryOptions } from '../../hooks/useEventsQuery';
import { useUserId } from '../../hooks/useUserId';

// Miscellaneous
import { supabase } from '../../lib/supabase';
import Button from '../Button/Button';
import Paragraph from '../Paragraph/Paragraph';

// The habits query only holds active habits; this one includes archived ones.
const fetchAllHabits = async () => {
  const { data, error } = await supabase
    .from('habits')
    .select('id, name, planned_days, weekly_target, active, created_at')
    .order('created_at');

  if (error) throw error;
  return data.map((row) => toHabit(row));
};

const DownloadDataButton = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  const session = useSession();
  const settings = useSettings();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    setFailed(false);

    try {
      const [habits, events] = await Promise.all([
        fetchAllHabits(),
        queryClient.query(eventsQueryOptions(userId)),
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
        // Kept in this browser's local storage, not on the server.
        settings: {
          birthYear: settings.birthYear,
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

  return (
    <>
      <Button
        disabled={busy}
        onClick={() => {
          void handleDownload();
        }}
      >
        {busy ? 'Preparing' : 'Download data'}
      </Button>

      {failed && <Paragraph>Something went wrong. Please try again.</Paragraph>}
    </>
  );
};

export default DownloadDataButton;
