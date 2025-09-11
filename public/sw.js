const CACHE_NAME = 'weekendly-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add other static assets as needed
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // For HTML pages, try to fetch fresh version in background
          if (event.request.destination === 'document') {
            event.waitUntil(
              fetch(event.request)
                .then((response) => {
                  if (response.ok) {
                    return caches.open(CACHE_NAME)
                      .then((cache) => {
                        cache.put(event.request, response.clone());
                      });
                  }
                })
                .catch(() => {
                  // Network failed, use cached version
                })
            );
          }
          return cachedResponse;
        }

        // No cached version, try network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response;
            }

            // Clone the response before caching
            const responseToCache = response.clone();

            // Cache successful responses
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed and no cache available
            // Return a custom offline page for HTML requests
            if (event.request.destination === 'document') {
              return new Response(
                `<!DOCTYPE html>
                <html>
                <head>
                  <title>Weekendly - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      font-family: system-ui, -apple-system, sans-serif; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      height: 100vh; 
                      margin: 0;
                      background: #f8fafc;
                      color: #334155;
                    }
                    .offline-container {
                      text-align: center;
                      max-width: 400px;
                      padding: 2rem;
                    }
                    h1 { color: #6366f1; margin-bottom: 1rem; }
                    p { margin-bottom: 1.5rem; line-height: 1.6; }
                    button {
                      background: #6366f1;
                      color: white;
                      border: none;
                      padding: 0.75rem 1.5rem;
                      border-radius: 0.5rem;
                      cursor: pointer;
                      font-size: 1rem;
                    }
                    button:hover { background: #5855eb; }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <h1>📱 You're Offline</h1>
                    <p>Your saved weekend plans are still available locally. Once you're back online, you'll have access to all features.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                  </div>
                </body>
                </html>`,
                {
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            }
            
            // For other requests, just fail
            throw new Error('Network failed and no cache available');
          });
      })
  );
});

// Background sync for future enhancements
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background sync tasks here
  }
});

// Push notifications (for future enhancements)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    );
  }
});