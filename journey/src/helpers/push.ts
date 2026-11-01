// Miscellaneous
import { supabase } from '../lib/supabase';

export const pushSupported =
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

// The browser expects the VAPID public key as bytes, not base64url text.
const toKeyBytes = (base64Url: string) => {
  const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

/** Asks for permission, subscribes this device and stores it. False if denied. */
export const enablePush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      applicationServerKey: toKeyBytes(import.meta.env.VITE_VAPID_PUBLIC_KEY),
      userVisibleOnly: true,
    }));

  const { endpoint, keys } = subscription.toJSON();
  if (!endpoint || !keys) throw new Error('Incomplete push subscription');

  // user_id fills itself in from the signed-in user.
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { auth: keys.auth, endpoint, p256dh: keys.p256dh },
      { onConflict: 'endpoint' },
    );

  if (error) throw error;
  return true;
};

/** Removes this device's subscription from the server and the browser. */
export const disablePush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', subscription.endpoint);

  if (error) throw error;
  await subscription.unsubscribe();
};
