const CACHE_NAME = 'marrengula-it-v3';
const STATIC_CACHE = 'marrengula-static-v3';
const DYNAMIC_CACHE = 'marrengula-dynamic-v3';
const IMAGE_CACHE = 'marrengula-images-v3';
const API_CACHE = 'marrengula-api-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

const CACHE_STRATEGIES = {
  cacheFirst: ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp', '.avif'],
  networkFirst: ['.html', '.js', '.css'],
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
  console.log('[SW] Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const cachesToDelete = cacheNames.filter(
        (name) => name.startsWith('marrengula-') && 
                 name !== STATIC_CACHE && 
                 name !== DYNAMIC_CACHE && 
                 name !== IMAGE_CACHE && 
                 name !== API_CACHE
      );
      return Promise.all(cachesToDelete.map((name) => caches.delete(name)));
    }).then(() => {
      console.log('[SW] Service Worker activated');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.origin !== location.origin) {
    return;
  }

  const extension = url.pathname.split('.').pop()?.toLowerCase() || '';
  
  if (CACHE_STRATEGIES.cacheFirst.some(ext => request.url.includes(ext))) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (url.hostname === 'images.unsplash.com' || 
      url.hostname === 'img.icons8.com' ||
      url.hostname === 'cdn-icons-png.flaticon.com' ||
      url.hostname.includes('supabase') ||
      url.hostname.includes('cloudflare') ||
      url.hostname.includes('amazonaws')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed:', error.message);
    return caches.match('/offline.html') || new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first failed, trying cache:', error.message);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return caches.match('/offline.html') || new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Marrengula-IT';
  const options = {
    body: data.body || 'Nova notificação da Marrengula-IT',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100, 50, 100],
    tag: 'marrengula-notification',
    renotify: true,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-96x96.png'
      }
    ],
    dir: 'ltr',
    lang: 'pt-MZ',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      }).then(() => {
        return self.clients.matchAll();
      })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
  if (event.tag === 'sync-wishlist') {
    event.waitUntil(syncWishlist());
  }
});

async function syncCart() {
  console.log('[SW] Syncing cart...');
}

async function syncWishlist() {
  console.log('[SW] Syncing wishlist...');
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  console.log('[SW] Updating content in background...');
}

console.log('[SW] Marrengula-IT Service Worker loaded');
