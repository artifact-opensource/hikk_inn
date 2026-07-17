// HikkInn service worker — push + offline shell.
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

self.addEventListener('push', (event) => {
  let data = { title: 'HikkInn', body: '', url: '/' };
  try { data = Object.assign(data, event.data ? event.data.json() : {}); } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/art/season-summer.png',
      badge: '/art/season-summer.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || '/'));
});

// Minimal offline cache for the app shell.
const CACHE = 'hikkInn-shell-v1';
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((c) => c || caches.match('/')))
  );
});
