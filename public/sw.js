// StitchAI Atelier Progressive Web App Service Worker
// Version: 1.0.0 - Cache-First for static assets, Network-First for dynamic endpoints

const CACHE_NAME = 'stitchai-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

// Install Event: Precaches core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[StitchAI SW] Precaching application shell assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[StitchAI SW] Precache partial error (expected in dev mode):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleans up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[StitchAI SW] Deleting obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate for app assets, Network-First for API requests
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests or Firebase Firestore WebSocket streams
  if (request.method !== 'GET' || request.url.includes('firestore.googleapis.com')) {
    return;
  }

  // Google Fonts & Static Images: Cache First
  if (
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('fonts.gstatic.com') ||
    request.url.match(/\.(png|jpg|jpeg|svg|webp|woff2?)$/i)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback if offline
          return caches.match('/');
        });
      })
    );
    return;
  }

  // HTML Navigation: Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Default: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[StitchAI SW] Network fetch failed, returning cache if available:', err);
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync / Notification Event Hook
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('/');
    })
  );
});
