// @ts-nocheck
// Runs on Deno; the editor's Node-based TypeScript can't resolve `npm:` imports or `Deno`.

// Sends due reminders as Web Push. Invoked every 15 minutes by pg_cron (see schema.sql).
//
// Deploy:
//   supabase functions deploy send-reminders --no-verify-jwt
//   supabase secrets set CRON_SECRET=... VAPID_SUBJECT=mailto:you@example.com \
//     VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=...
// Generate the VAPID keys with `npx web-push generate-vapid-keys`; the public key
// is also the app's VITE_VAPID_PUBLIC_KEY.

import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
);

// A reminder still fires up to this long after its time, to absorb cron delays.
const WINDOW_MINUTES = 60;

const messages: Record<string, { body: string; title: string; url: string }> = {
  retro: {
    body: 'Take a moment to look back on your week.',
    title: 'Time for your retro',
    url: '/retro',
  },
};

interface Reminder {
  id: string;
  kind: string;
  last_sent_on: null | string;
  remind_time: string;
  timezone: string;
  user_id: string;
  weekday: string;
}

/** The current date, weekday and minutes since midnight in the given zone. */
const localNow = (timeZone: string, now: Date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      timeZone,
      weekday: 'short',
      year: 'numeric',
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    weekday: parts.weekday.toLowerCase(),
  };
};

const isDue = (reminder: Reminder, now: Date) => {
  const local = localNow(reminder.timezone, now);
  const [hours, minutes] = reminder.remind_time.split(':').map(Number);
  const elapsed = local.minutes - (hours * 60 + minutes);

  return (
    local.weekday === reminder.weekday &&
    elapsed >= 0 &&
    elapsed < WINDOW_MINUTES &&
    reminder.last_sent_on !== local.date
  );
};

const send = async (reminder: Reminder, localDate: string) => {
  const message = messages[reminder.kind];
  let delivered = 0;

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', reminder.user_id);

  if (error) throw error;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { auth: subscription.auth, p256dh: subscription.p256dh },
          },
          JSON.stringify(message),
        );
        delivered++;
      } catch (error) {
        // The push service says this subscription is gone for good.
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', subscription.id);
        } else {
          console.error('Push failed', reminder.id, error);
        }
      }
    }),
  );

  await supabase
    .from('reminders')
    .update({ last_sent_on: localDate })
    .eq('id', reminder.id);

  return { delivered, subscriptions: subscriptions.length };
};

Deno.serve(async (request) => {
  if (request.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('id, kind, last_sent_on, remind_time, timezone, user_id, weekday');

  if (error) return new Response(error.message, { status: 500 });

  const now = new Date();
  let delivered = 0;
  let due = 0;
  let subscriptions = 0;

  for (const reminder of reminders as Reminder[]) {
    try {
      if (!isDue(reminder, now)) continue;
      due++;
      const result = await send(
        reminder,
        localNow(reminder.timezone, now).date,
      );
      delivered += result.delivered;
      subscriptions += result.subscriptions;
    } catch (error) {
      // One bad row (e.g. an unknown time zone) must not block the others.
      console.error('Reminder failed', reminder.id, error);
    }
  }

  return Response.json({ delivered, due, subscriptions });
});
