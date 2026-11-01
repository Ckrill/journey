// Take over open tabs right away, so a new push handler isn't stuck waiting.
self.addEventListener('install', () => {
  void self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data?.json() ?? {};
  } catch {
    // DevTools' Push button sends plain text.
    payload = { body: event.data?.text() };
  }
  const { body, title, url } = payload;

  event.waitUntil(
    self.registration.showNotification(title ?? 'Journey', {
      body,
      data: { url: url ?? '/' },
      icon: '/android-chrome-192x192.png',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { url } = event.notification.data;

  event.waitUntil(
    self.clients
      .matchAll({ includeUncontrolled: true, type: 'window' })
      .then((windows) => {
        const open = windows[0];
        if (!open) return self.clients.openWindow(url);
        return open.navigate(url).then((client) => client?.focus());
      }),
  );
});
