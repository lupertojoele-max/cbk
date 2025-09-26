// CBK Racing PWA Service Worker
// Advanced caching strategy for optimal performance

const CACHE_NAME = 'cbk-racing-v1.0.0';
const STATIC_CACHE_NAME = 'cbk-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cbk-dynamic-v1.0.0';
const IMAGE_CACHE_NAME = 'cbk-images-v1.0.0';

// Cache different types of resources with different strategies
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/site.webmanifest',
  '/favicon.ico',
  '/images/cbk-logo.png',
  '/images/cbk-logo-black.png',
  '/_next/static/css/app/globals.css'
];

const CACHE_STRATEGIES = {
  // Cache First - for static assets
  CACHE_FIRST: 'cache-first',
  // Network First - for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - for images and frequent updates
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('CBK Racing SW: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('CBK Racing SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('CBK Racing SW: Static assets cached successfully');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('CBK Racing SW: Error caching static assets:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('CBK Racing SW: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const validCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log('CBK Racing SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('CBK Racing SW: Activated successfully');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isImage(request)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE_NAME));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache First Strategy - for static assets that rarely change
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('CBK Racing SW: Cache First error:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy - for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('CBK Racing SW: Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (isNavigationRequest(request)) {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }

    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate Strategy - for images and frequently updated content
async function staleWhileRevalidate(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);

    // Fetch in background to update cache
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    });

    // Return cached version immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }

    // Otherwise wait for network
    return await fetchPromise;
  } catch (error) {
    console.error('CBK Racing SW: Stale While Revalidate error:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Helper functions to determine request types
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.includes('/_next/static/') ||
    url.pathname.includes('/static/') ||
    url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/) ||
    STATIC_ASSETS.some(asset => url.pathname === asset)
  );
}

function isImage(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('CBK Racing SW: Background sync event:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('CBK Racing SW: Performing background sync');
  // Implement background sync logic here
  // e.g., send queued form submissions, sync data, etc.
}

// Push notifications support (future enhancement)
self.addEventListener('push', (event) => {
  console.log('CBK Racing SW: Push event received');

  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    tag: 'cbk-racing-notification',
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('CBK Racing', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('CBK Racing SW: Notification clicked');

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('CBK Racing Service Worker loaded successfully');